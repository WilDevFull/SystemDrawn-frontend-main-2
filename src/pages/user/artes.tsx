// src/pages/user/artes.tsx
import { useRouter } from '@/lib/navigation';
import {
  DESCRICAO_MAXIMA,
  DESCRICAO_MINIMA,
  MEMBROS,
  simularTatuagemIA,
  simularTatuagemPorTexto,
  type Membro,
} from '@/services/simulacao.service';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native-web';

const MARGEM_BORDA = 0.04;
const LIMITE_FUNDO = 0.2;

const mensagemCarregamento = (segundos: number) => {
  if (segundos < 5) return 'Enviando o pedido para a IA...';
  if (segundos < 30) return 'A IA está criando a sua tatuagem...';
  return 'A IA está com fila, mas continua trabalhando...';
};

const pareceTerFundo = ({ data, width, height }: ImageData) => {
  const margem = Math.max(1, Math.round(Math.min(width, height) * MARGEM_BORDA));
  let total = 0;
  let comFundo = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const naBorda = x < margem || x >= width - margem || y < margem || y >= height - margem;
      if (!naBorda) continue;

      const i = (y * width + x) * 4;
      const transparente = data[i + 3] < 40;
      const branco = data[i] > 225 && data[i + 1] > 225 && data[i + 2] > 225;
      total++;
      if (!transparente && !branco) comFundo++;
    }
  }

  return total > 0 && comFundo / total > LIMITE_FUNDO;
};

export default function ArtesScreen() {
  const router = useRouter();

  const [imagemOriginal, setImagemOriginal] = useState<string | null>(null);
  const [membro, setMembro] = useState<Membro>('Braço');
  const [promptText, setPromptText] = useState<string>('black ink tattoo');
  const [imagemSimulada, setImagemSimulada] = useState<string | null>(null);
  const [modoTeste, setModoTeste] = useState<boolean>(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [avisoFundo, setAvisoFundo] = useState<boolean>(false);
  const [modoTexto, setModoTexto] = useState<boolean>(false);
  const [descricao, setDescricao] = useState<string>('');
  const [segundos, setSegundos] = useState<number>(0);

  const descricaoValida = descricao.trim().length >= DESCRICAO_MINIMA;
  const podeGerar = modoTexto ? descricaoValida : Boolean(imagemOriginal);

  
  const pedidoAtual = useRef(0);
  const resultadoRef = useRef<any>(null);
  const erroRef = useRef<any>(null);

  
  useEffect(() => {
    if (carregando || imagemSimulada) {
      resultadoRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    }
  }, [carregando, imagemSimulada]);

  useEffect(() => {
    if (mensagemErro) {
      erroRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    }
  }, [mensagemErro]);

  useEffect(() => {
    if (!carregando) return;
    const relogio = setInterval(() => setSegundos((atual) => atual + 1), 1000);
    return () => clearInterval(relogio);
  }, [carregando]);

  
  const processarImagemWeb = (file: File): Promise<{ dataUrl: string; temFundo: boolean }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const MAX_SIZE = 768;
          let width = img.width;
          let height = img.height;

          if (!width || !height) {
            reject(new Error('Imagem sem tamanho.'));
            return;
          }

          if (width > height && width > MAX_SIZE) {
            height = Math.max(1, Math.round((height * MAX_SIZE) / width));
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.max(1, Math.round((width * MAX_SIZE) / height));
            height = MAX_SIZE;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Erro ao processar a imagem.'));
            return;
          }

          
          
          ctx.drawImage(img, 0, 0, width, height);
          const temFundo = pareceTerFundo(ctx.getImageData(0, 0, width, height));

          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve({ dataUrl, temFundo });
        };
        img.onerror = () => reject(new Error('Erro ao processar a imagem.'));
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    });
  };

  
  const handleSelecionarFoto = () => {
    setMensagemErro(null);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event: any) => {
      const file = event.target?.files?.[0];
      if (!file) return;

      try {
        const { dataUrl: base64Otimizado, temFundo } = await processarImagemWeb(file);
        
        pedidoAtual.current++;
        setCarregando(false);
        setImagemOriginal(base64Otimizado);
        setAvisoFundo(temFundo);
        setImagemSimulada(null);
      } catch {
        setMensagemErro('Não foi possível carregar a imagem selecionada.');
      }
    };

    input.click();
  };

  
  const handleAlternarModoTexto = () => {
    pedidoAtual.current++;
    setCarregando(false);
    setModoTexto((atual) => !atual);
    setImagemSimulada(null);
    setMensagemErro(null);
  };

  const handleEscolherMembro = (item: Membro) => {
    if (item === membro) return;
    pedidoAtual.current++;
    setMembro(item);
    setImagemSimulada(null);
    setMensagemErro(null);
  };

  
  const handleSimular = async () => {
    if (modoTexto && !descricaoValida) {
      setMensagemErro(`Descreva a tatuagem que você quer com pelo menos ${DESCRICAO_MINIMA} letras.`);
      return;
    }

    if (!modoTexto && !imagemOriginal) {
      setMensagemErro('Por favor, selecione o desenho da tatuagem primeiro.');
      return;
    }

    const id = ++pedidoAtual.current;

    try {
      setSegundos(0);
      setCarregando(true);
      setMensagemErro(null);
      setImagemSimulada(null);
      setAviso(null);

      const resposta = modoTexto
        ? await simularTatuagemPorTexto(descricao.trim(), membro)
        : await simularTatuagemIA(imagemOriginal as string, membro, promptText);
      if (id !== pedidoAtual.current) return;

      if (resposta.sucesso && resposta.imagemSimulada) {
        setImagemSimulada(resposta.imagemSimulada);
        setModoTeste(Boolean(resposta.modoTeste));
        setAviso(resposta.aviso ?? null);
      } else {
        setMensagemErro(resposta.erro || 'A IA não conseguiu gerar a simulação.');
      }
    } catch (error: any) {
      if (id !== pedidoAtual.current) return;
      console.error('Erro ao conectar com o backend (porta 3000):', error);
    
      const msgServidor = error?.response?.data?.erro || error?.response?.data?.message;

      if (msgServidor) {
        setMensagemErro(msgServidor);
      } else if (error?.code === 'ECONNABORTED') {
        setMensagemErro('A IA demorou demais para responder. Tente novamente em instantes.');
      } else {
        setMensagemErro('Não foi possível falar com o servidor agora. Tente novamente em instantes.');
      }
    } finally {
      if (id === pedidoAtual.current) setCarregando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Inteligência Artificial • ControlNet</Text>
        <Text style={styles.title}>Simulador Tatoo</Text>
        <Text style={styles.description}>
          Envie o desenho ou descreva a tatuagem que você quer, escolha onde no corpo e veja uma prévia de como ela ficaria.
        </Text>

        <TouchableOpacity
          style={[styles.switchRow, modoTexto && styles.switchRowAtivo, carregando && styles.buttonDisabled]}
          onPress={handleAlternarModoTexto}
          disabled={carregando}
          role="switch"
          aria-checked={modoTexto}
        >
          <View style={[styles.switchTrack, modoTexto && styles.switchTrackAtivo]}>
            <View style={[styles.switchKnob, modoTexto && styles.switchKnobAtivo]} />
          </View>
          <View style={styles.switchTextos}>
            <Text style={styles.switchTitulo}>Gerar por descrição em texto</Text>
            <Text style={styles.switchAjuda}>
              {modoTexto
                ? 'Ligado: o envio de imagem está desativado. Desligue para voltar a enviar um desenho.'
                : 'Não tem o desenho? Ligue para descrever a tatuagem com palavras.'}
            </Text>
          </View>
        </TouchableOpacity>

        {modoTexto && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>1. Descreva a tatuagem que você quer:</Text>
            <TextInput
              style={[styles.input, styles.inputDescricao]}
              value={descricao}
              onChangeText={setDescricao}
              editable={!carregando}
              multiline
              numberOfLines={3}
              maxLength={DESCRICAO_MAXIMA}
              aria-label="Descrição da tatuagem"
              placeholder="Ex: leão com coroa e rosas, traço fino, preto e cinza"
              placeholderTextColor="#666"
            />
            <Text style={styles.contador}>
              {descricao.length}/{DESCRICAO_MAXIMA}
            </Text>
          </View>
        )}

        <View style={[styles.guideBox, modoTexto && styles.areaDesativada]}>
          <Text style={styles.guideTitle}>Use uma imagem sem fundo</Text>
          <Text style={styles.guideText}>
            Envie só o desenho da tatuagem: de preferência um PNG com fundo transparente ou o desenho sobre um fundo branco liso.
          </Text>
          <Text style={styles.guideText}>
            Evite fotos com parede, papel, mesa, sombras ou outros objetos em volta, porque eles podem aparecer junto na pele.
          </Text>
          <Text style={styles.guideText}>
            Se a sua imagem tiver fundo, use um site ou aplicativo de remover fundo antes de enviar.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.uploadButton, (carregando || modoTexto) && styles.buttonDisabled]}
          onPress={handleSelecionarFoto}
          disabled={carregando || modoTexto}
          aria-disabled={carregando || modoTexto}
        >
          <Text style={styles.uploadButtonText}>
            {modoTexto
              ? 'Envio de imagem desativado (opção por texto ligada)'
              : imagemOriginal
                ? '1. Trocar desenho'
                : '1. Selecionar desenho da tatuagem'}
          </Text>
        </TouchableOpacity>
        {avisoFundo && !modoTexto ? (
          <View style={styles.warningBox} role="status">
            <Text style={styles.warningText}>
              Sua imagem parece ter fundo. A simulação pode sair com manchas em volta do desenho. Se puder, envie a mesma imagem sem fundo.
            </Text>
          </View>
        ) : (
          <View style={styles.hintSpacer} />
        )}

        {/* PASSO 2: ESCOLHER O MEMBRO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>2. Onde no corpo?</Text>
          <View style={styles.membrosRow}>
            {MEMBROS.map((item) => {
              const selecionado = membro === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.membroOption,
                    selecionado && styles.membroSelected,
                    carregando && styles.buttonDisabled,
                  ]}
                  onPress={() => handleEscolherMembro(item)}
                  disabled={carregando}
                  role="button"
                  aria-pressed={selecionado}
                >
                  <Text style={[styles.membroText, selecionado && styles.membroTextSelected]}>
                    {selecionado ? `✓ ${item}` : item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {!modoTexto && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              3. Estilo da tatuagem (opcional, em inglês gera melhores resultados):
            </Text>
            <TextInput
              style={styles.input}
              value={promptText}
              onChangeText={setPromptText}
              editable={!carregando}
              aria-label="Estilo da tatuagem"
              placeholder="Ex: blackwork floral tattoo, fine line"
              placeholderTextColor="#666"
            />
          </View>
        )}

        {/* AVISO DE ERRO */}
        {mensagemErro && (
          <View style={styles.errorBox} role="alert" ref={erroRef}>
            <Text style={styles.errorText}>{mensagemErro}</Text>
          </View>
        )}

        {/* PASSO 4: BOTÃO DE SIMULAR */}
        <TouchableOpacity
          style={[styles.button, !podeGerar && styles.buttonDisabled]}
          onPress={handleSimular}
          disabled={!podeGerar || carregando}
        >
          {carregando ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.buttonText}>Gerando a simulação...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>
              {modoTexto ? '3' : '4'}. Gerar simulação em: {membro}
            </Text>
          )}
        </TouchableOpacity>

        {/* COMPARAÇÃO LADO A LADO */}
        {((imagemOriginal && !modoTexto) || imagemSimulada || carregando) && (
          <View style={styles.resultsGrid}>
            {imagemOriginal && !modoTexto && (
              <View style={styles.imageBox}>
                <Text style={styles.imageTitle}>Seu desenho:</Text>
                <Image
                  source={{ uri: imagemOriginal }}
                  aria-label="Desenho enviado"
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {(carregando || imagemSimulada) && (
              <View style={styles.imageBox} ref={resultadoRef}>
                <Text style={styles.imageTitle}>
                  {modoTeste && !carregando
                    ? `Prévia em: ${membro} (modo de teste)`
                    : `Resultado da IA em: ${membro}`}
                </Text>
                {carregando ? (
                  <View style={styles.loadingBox} role="status" aria-live="polite">
                    <ActivityIndicator size="large" color="#C084FC" />
                    <Text style={styles.loadingTitle}>{mensagemCarregamento(segundos)}</Text>
                    <Text style={styles.loadingTime}>
                      {segundos} s · pode levar até 2 minutos
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: imagemSimulada as string }}
                    aria-label={`Simulação da tatuagem em: ${membro}`}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                )}
                {modoTeste && !carregando && (
                  <Text style={styles.testNotice}>
                    Modo de teste: esta imagem é só o desenho colado na foto, sem a IA.
                  </Text>
                )}
                {aviso && !carregando && (
                  <Text style={styles.testNotice}>{aviso}</Text>
                )}
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/novo-agendamento')}
        >
          <Text style={styles.secondaryButtonText}>Ir para Agendamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#09090B',
    padding: 0,
  },
  card: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    flex: 1,
    minHeight: 440,
    borderTopWidth: 1,
    borderColor: '#302E35',
    padding: 32,
  },
  eyebrow: {
    color: '#C084FC',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  title: {
    color: '#FFF',
    fontFamily: 'Georgia',
    fontSize: 40,
    fontWeight: '500',
    marginBottom: 12,
  },
  description: {
    color: '#AAA6B0',
    maxWidth: 640,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 28,
  },
  uploadButton: {
    backgroundColor: '#17171B',
    borderWidth: 1,
    borderColor: '#A855F7',
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  guideBox: {
    backgroundColor: '#17121F',
    borderWidth: 1,
    borderColor: '#3B2A55',
    borderRadius: 5,
    padding: 16,
    marginBottom: 14,
    gap: 6,
  },
  guideTitle: {
    color: '#C084FC',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  guideText: {
    color: '#C4BFCA',
    fontSize: 13,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#2A2110',
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: 5,
    padding: 14,
    marginTop: 4,
    marginBottom: 22,
  },
  warningText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
  },
  hintSpacer: {
    height: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#17171B',
    borderWidth: 1,
    borderColor: '#302E35',
    borderRadius: 5,
    padding: 14,
    marginBottom: 18,
  },
  switchRowAtivo: {
    backgroundColor: '#2A1B3D',
    borderColor: '#A855F7',
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3A3740',
    padding: 3,
    justifyContent: 'center',
  },
  switchTrackAtivo: {
    backgroundColor: '#A855F7',
  },
  switchKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF',
  },
  switchKnobAtivo: {
    alignSelf: 'flex-end',
  },
  switchTextos: {
    flex: 1,
    gap: 4,
  },
  switchTitulo: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  switchAjuda: {
    color: '#AAA6B0',
    fontSize: 13,
    lineHeight: 19,
  },
  inputDescricao: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  contador: {
    color: '#8A8590',
    fontSize: 12,
    marginTop: 6,
  },
  areaDesativada: {
    opacity: 0.45,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    color: '#C4BFCA',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  membrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  membroOption: {
    backgroundColor: '#17171B',
    borderWidth: 1,
    borderColor: '#302E35',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  membroSelected: {
    backgroundColor: '#2A1B3D',
    borderColor: '#A855F7',
  },
  membroText: {
    color: '#C4BFCA',
    fontWeight: '600',
    fontSize: 14,
  },
  membroTextSelected: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#111114',
    borderWidth: 1,
    borderColor: '#302E35',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFF',
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: '#2A1010',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 5,
    padding: 14,
    marginBottom: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#A855F7',
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 28,
  },
  imageBox: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#111114',
    borderRadius: 5,
    padding: 16,
    borderWidth: 1,
    borderColor: '#302E35',
    alignItems: 'center',
  },
  imageTitle: {
    color: '#C084FC',
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 14,
  },
  loadingBox: {
    width: '100%',
    height: 320,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3B2A55',
    backgroundColor: '#17121F',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  loadingTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  loadingTime: {
    color: '#AAA6B0',
    fontSize: 13,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 320,
    borderRadius: 5,
  },
  testNotice: {
    color: '#FBBF24',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#49454F',
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    color: '#C4BFCA',
    fontWeight: '700',
    fontSize: 14,
  },
});
