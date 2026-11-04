import { useAgendaDoDia } from '@/pages/admin/appointments';
import { useMemo, useState, type FormEvent } from 'react';
import { ArrowDownLeft, ArrowUpRight, Check, Minus, Package, Plus, Search, Target, Wallet, X } from 'lucide-react';
import '@/styles/admin-dashboard.css';

type TransactionType = 'income' | 'expense';
type TransactionStatus = 'pending' | 'settled';
type TransactionFilter = 'all' | TransactionType;
type ModalType = 'transaction' | 'inventory' | 'goal' | 'contribution' | null;

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
};

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  minimum: number;
};

type StudioGoal = {
  id: number;
  name: string;
  target: number;
  saved: number;
  deadline: string;
};

const initialTransactions: Transaction[] = [
  { id: 1, description: 'Sinal Tatuagem Fechamento Braço', amount: 650, type: 'income', status: 'pending' },
  { id: 2, description: 'Aplicação Piercing Septo', amount: 180, type: 'income', status: 'settled' },
  { id: 3, description: 'Fornecedor de Tintas e Agulhas', amount: 420, type: 'expense', status: 'pending' },
  { id: 4, description: 'Aluguel do Estúdio', amount: 1800, type: 'expense', status: 'settled' },
  { id: 5, description: 'Sessão Tattoo Floral', amount: 900, type: 'income', status: 'pending' },
];

const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Cartuchos RL/MG', quantity: 12, minimum: 10 },
  { id: 2, name: 'Joias Piercing Titânio', quantity: 4, minimum: 8 },
  { id: 3, name: 'Tinta Preta Dynamic', quantity: 6, minimum: 5 },
  { id: 4, name: 'Luvas Nitrílicas', quantity: 18, minimum: 12 },
];

const initialGoals: StudioGoal[] = [
  { id: 1, name: 'Nova Maca Hidráulica', target: 4500, saved: 1800, deadline: '30/12/2026' },
  { id: 2, name: 'Máquina Pen Wireless', target: 3200, saved: 1250, deadline: '15/02/2027' },
  { id: 3, name: 'Autoclave / Esterilização', target: 5800, saved: 2900, deadline: '30/03/2027' },
];

const currency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function AdminDashboardScreen() {
  const { agendamentos: appointments, erro: appointmentsError } = useAgendaDoDia();
  const indicators = [
    { label: 'Agendamentos de Hoje', value: appointments.length },
    { label: 'Pendentes', value: appointments.filter((item) => item.status === 'pending').length },
    { label: 'Confirmados', value: appointments.filter((item) => item.status === 'confirmed').length },
    { label: 'Cancelados', value: appointments.filter((item) => item.status === 'cancelled').length },
  ];

  const [transactions, setTransactions] = useState(initialTransactions);
  const [inventory, setInventory] = useState(initialInventory);
  const [goals, setGoals] = useState(initialGoals);
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalType>(null);
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>('income');
  const [inventoryName, setInventoryName] = useState('');
  const [inventoryQuantity, setInventoryQuantity] = useState('1');
  const [inventoryMinimum, setInventoryMinimum] = useState('1');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [contributionGoalId, setContributionGoalId] = useState<number | null>(null);
  const [contributionAmount, setContributionAmount] = useState('100');

  const incomeTotal = transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0);
  const expenseTotal = transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0);
  const financialMax = Math.max(incomeTotal, expenseTotal, 1);
  const tattooCount = appointments.filter((item) => item.type === 'tatuagem').length;
  const piercingCount = appointments.length - tattooCount;
  const serviceTotal = tattooCount + piercingCount;
  const filteredTransactions = useMemo(
    () => transactions.filter((item) => {
      const matchesFilter = filter === 'all' || item.type === filter;
      return matchesFilter && item.description.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'));
    }),
    [filter, search, transactions],
  );

  const closeModal = () => setModal(null);

  const addTransaction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(transactionAmount);
    if (!transactionDescription.trim() || !Number.isFinite(amount) || amount <= 0) return;
    setTransactions((current) => [
      { id: Date.now(), description: transactionDescription.trim(), amount, type: transactionType, status: 'pending' },
      ...current,
    ]);
    setTransactionDescription('');
    setTransactionAmount('');
    setModal(null);
  };

  const addInventoryItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantity = Number(inventoryQuantity);
    const minimum = Number(inventoryMinimum);
    if (!inventoryName.trim() || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(minimum) || minimum < 0) return;
    setInventory((current) => [
      ...current,
      { id: Date.now(), name: inventoryName.trim(), quantity, minimum },
    ]);
    setInventoryName('');
    setInventoryQuantity('1');
    setInventoryMinimum('1');
    setModal(null);
  };

  const addGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = Number(goalTarget);
    if (!goalName.trim() || !Number.isFinite(target) || target <= 0 || !goalDeadline) return;
    setGoals((current) => [
      ...current,
      { id: Date.now(), name: goalName.trim(), target, saved: 0, deadline: new Date(`${goalDeadline}T12:00:00`).toLocaleDateString('pt-BR') },
    ]);
    setGoalName('');
    setGoalTarget('');
    setGoalDeadline('');
    setModal(null);
  };

  const addContribution = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(contributionAmount);
    if (contributionGoalId === null || !Number.isFinite(amount) || amount <= 0) return;
    setGoals((current) => current.map((goal) =>
      goal.id === contributionGoalId ? { ...goal, saved: goal.saved + amount } : goal,
    ));
    setModal(null);
  };

  const openContribution = (goalId: number) => {
    setContributionGoalId(goalId);
    setContributionAmount('100');
    setModal('contribution');
  };

  const toggleTransactionStatus = (id: number) => {
    setTransactions((current) => current.map((item) =>
      item.id === id ? { ...item, status: item.status === 'pending' ? 'settled' : 'pending' } : item,
    ));
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral e gestão do estúdio</p>
        </div>
        <span className="dashboard-data-label">Agenda real · finanças simuladas</span>
      </header>

      {appointmentsError && <p className="dashboard-empty">{appointmentsError}</p>}

      <section className="dashboard-kpis" aria-label="Indicadores de agendamentos">
        {indicators.map((indicator) => (
          <article key={indicator.label} className="dashboard-kpi">
            <span className="dashboard-kpi-accent" />
            <p>{indicator.label}</p>
            <strong>{indicator.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-section" aria-labelledby="studio-overview-title">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">VISÃO DO ESTÚDIO</p>
            <h2 id="studio-overview-title">Gráfico e proporção</h2>
          </div>
        </div>
        <div className="dashboard-overview-grid">
          <article className="dashboard-panel">
            <h3>Serviços realizados</h3>
            <p className="dashboard-panel-hint">Distribuição por tipo de serviço</p>
            <div className="dashboard-bar-row">
              <div className="dashboard-bar-label"><span>Tatuagem</span><strong>{tattooCount}</strong></div>
              <div className="dashboard-bar-track"><span className="dashboard-bar-fill purple" style={{ width: `${serviceTotal ? (tattooCount / serviceTotal) * 100 : 0}%` }} /></div>
            </div>
            <div className="dashboard-bar-row">
              <div className="dashboard-bar-label"><span>Piercing</span><strong>{piercingCount}</strong></div>
              <div className="dashboard-bar-track"><span className="dashboard-bar-fill violet" style={{ width: `${serviceTotal ? (piercingCount / serviceTotal) * 100 : 0}%` }} /></div>
            </div>
            <p className="dashboard-chart-footnote">{serviceTotal} agendamentos hoje</p>
          </article>
          <article className="dashboard-panel">
            <h3>Entradas vs. saídas</h3>
            <p className="dashboard-panel-hint">Movimentação financeira do mês</p>
            <div className="dashboard-bar-row">
              <div className="dashboard-bar-label"><span><i className="dashboard-legend-dot green" />Entradas</span><strong>{currency(incomeTotal)}</strong></div>
              <div className="dashboard-bar-track"><span className="dashboard-bar-fill green" style={{ width: `${(incomeTotal / financialMax) * 100}%` }} /></div>
            </div>
            <div className="dashboard-bar-row">
              <div className="dashboard-bar-label"><span><i className="dashboard-legend-dot red" />Saídas</span><strong>{currency(expenseTotal)}</strong></div>
              <div className="dashboard-bar-track"><span className="dashboard-bar-fill red" style={{ width: `${(expenseTotal / financialMax) * 100}%` }} /></div>
            </div>
            <p className="dashboard-chart-footnote">Saldo previsto: {currency(incomeTotal - expenseTotal)}</p>
          </article>
        </div>
      </section>

      <section className="dashboard-section" aria-labelledby="finance-title">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">FINANÇAS</p>
            <h2 id="finance-title">Contas a pagar e a receber</h2>
          </div>
          <button className="dashboard-button primary" type="button" onClick={() => setModal('transaction')}><Plus size={17} /> Nova Conta</button>
        </div>
        <div className="dashboard-finance-summary">
          <article className="dashboard-summary-card">
            <span className="dashboard-summary-icon purple"><Wallet size={18} /></span>
            <p>Saldo Previsto</p>
            <strong>{currency(incomeTotal - expenseTotal)}</strong>
          </article>
          <article className="dashboard-summary-card">
            <span className="dashboard-summary-icon green"><ArrowDownLeft size={18} /></span>
            <p>A Receber / Entradas</p>
            <strong className="text-green">{currency(incomeTotal)}</strong>
          </article>
          <article className="dashboard-summary-card">
            <span className="dashboard-summary-icon red"><ArrowUpRight size={18} /></span>
            <p>A Pagar / Despesas</p>
            <strong className="text-red">{currency(expenseTotal)}</strong>
          </article>
        </div>
        <div className="dashboard-panel dashboard-transactions">
          <div className="dashboard-transaction-tools">
            <div className="dashboard-filter-tabs" aria-label="Filtrar transações">
              {([
                ['all', 'Todas'],
                ['income', 'A Receber'],
                ['expense', 'A Pagar'],
              ] as const).map(([value, label]) => (
                <button key={value} type="button" className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>
              ))}
            </div>
            <label className="dashboard-search">
              <Search size={16} aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por descrição" />
            </label>
          </div>
          <div className="dashboard-transaction-list">
            {filteredTransactions.length === 0 ? (
              <p className="dashboard-empty">Nenhuma conta encontrada.</p>
            ) : filteredTransactions.map((item) => (
              <article className="dashboard-transaction" key={item.id}>
                <span className={`dashboard-transaction-icon ${item.type}`}>
                  {item.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </span>
                <div className="dashboard-transaction-description">
                  <strong>{item.description}</strong>
                  <span>{item.type === 'income' ? 'Receita' : 'Despesa'} · {item.status === 'settled' ? (item.type === 'income' ? 'Recebido' : 'Pago') : 'Pendente'}</span>
                </div>
                <strong className={item.type === 'income' ? 'text-green' : 'text-red'}>{item.type === 'income' ? '+' : '−'}{currency(item.amount)}</strong>
                <button
                  className={`dashboard-status-button ${item.status === 'settled' ? 'settled' : ''}`}
                  type="button"
                  onClick={() => toggleTransactionStatus(item.id)}
                  aria-label={item.status === 'settled' ? `Marcar ${item.description} como pendente` : `Marcar ${item.description} como pago ou recebido`}
                >
                  <Check size={15} /> {item.status === 'settled' ? 'Concluído' : item.type === 'income' ? 'Receber' : 'Pagar'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-section" aria-labelledby="inventory-title">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">MATERIAIS</p>
            <h2 id="inventory-title">Controle de estoque</h2>
          </div>
          <button className="dashboard-button secondary" type="button" onClick={() => setModal('inventory')}><Plus size={17} /> Novo Item</button>
        </div>
        <div className="dashboard-inventory-grid">
          {inventory.map((item) => {
            const lowStock = item.quantity <= item.minimum;
            const level = item.minimum > 0 ? Math.min((item.quantity / (item.minimum * 2)) * 100, 100) : (item.quantity > 0 ? 100 : 0);
            return (
              <article className={`dashboard-panel dashboard-inventory-card ${lowStock ? 'low-stock' : ''}`} key={item.id}>
                <div className="dashboard-inventory-title">
                  <span className="dashboard-summary-icon purple"><Package size={18} /></span>
                  <div><h3>{item.name}</h3><span>Estoque atual</span></div>
                </div>
                <div className="dashboard-stock-count"><strong>{item.quantity}</strong><span>mínimo {item.minimum}</span></div>
                <div className="dashboard-stock-track"><span className={lowStock ? 'low' : ''} style={{ width: `${level}%` }} /></div>
                <div className="dashboard-stock-footer">
                  {lowStock ? <span className="dashboard-low-alert">Estoque baixo</span> : <span className="dashboard-stock-ok">Estoque adequado</span>}
                  <div className="dashboard-stock-actions">
                    <button type="button" aria-label={`Remover uma unidade de ${item.name}`} onClick={() => setInventory((current) => current.map((entry) => entry.id === item.id ? { ...entry, quantity: Math.max(0, entry.quantity - 1) } : entry))}><Minus size={15} /></button>
                    <button type="button" aria-label={`Adicionar uma unidade de ${item.name}`} onClick={() => setInventory((current) => current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry))}><Plus size={15} /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-section" aria-labelledby="goals-title">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">PLANEJAMENTO</p>
            <h2 id="goals-title">Metas do estúdio</h2>
          </div>
          <button className="dashboard-button secondary" type="button" onClick={() => setModal('goal')}><Plus size={17} /> Nova Meta</button>
        </div>
        <div className="dashboard-goals-grid">
          {goals.map((goal) => {
            const progress = Math.min((goal.saved / goal.target) * 100, 100);
            return (
              <article className="dashboard-panel dashboard-goal-card" key={goal.id}>
                <div className="dashboard-goal-heading">
                  <span className="dashboard-summary-icon purple"><Target size={18} /></span>
                  <span>Prazo: {goal.deadline}</span>
                </div>
                <h3>{goal.name}</h3>
                <div className="dashboard-goal-target"><span>Valor da meta</span><strong>{currency(goal.target)}</strong></div>
                <div className="dashboard-goal-progress"><span style={{ width: `${progress}%` }} /></div>
                <p className="dashboard-goal-percent">{Math.round(progress)}% concluído</p>
                <div className="dashboard-goal-values">
                  <div><span>Economizado</span><strong className="text-green">{currency(goal.saved)}</strong></div>
                  <div><span>Faltam</span><strong>{currency(Math.max(goal.target - goal.saved, 0))}</strong></div>
                </div>
                <button className="dashboard-button secondary full-width" type="button" onClick={() => openContribution(goal.id)}><Plus size={16} /> Adicionar Valor</button>
              </article>
            );
          })}
        </div>
      </section>

      {modal && (
        <div className="dashboard-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dashboard-modal-title">
            <div className="dashboard-modal-heading">
              <h2 id="dashboard-modal-title">
                {modal === 'transaction' ? 'Nova conta' : modal === 'inventory' ? 'Novo item de estoque' : modal === 'goal' ? 'Nova meta' : 'Adicionar valor'}
              </h2>
              <button type="button" onClick={closeModal} aria-label="Fechar"><X size={20} /></button>
            </div>
            {modal === 'transaction' && (
              <form onSubmit={addTransaction}>
                <label>Descrição<input required value={transactionDescription} onChange={(event) => setTransactionDescription(event.target.value)} placeholder="Ex.: Sessão de tatuagem" /></label>
                <div className="dashboard-form-row">
                  <label>Tipo<select value={transactionType} onChange={(event) => setTransactionType(event.target.value as TransactionType)}><option value="income">A receber (receita)</option><option value="expense">A pagar (despesa)</option></select></label>
                  <label>Valor (R$)<input required min="0.01" step="0.01" type="number" value={transactionAmount} onChange={(event) => setTransactionAmount(event.target.value)} placeholder="0,00" /></label>
                </div>
                <button className="dashboard-button primary full-width" type="submit">Adicionar conta</button>
              </form>
            )}
            {modal === 'inventory' && (
              <form onSubmit={addInventoryItem}>
                <label>Nome do material<input required value={inventoryName} onChange={(event) => setInventoryName(event.target.value)} placeholder="Ex.: Agulhas descartáveis" /></label>
                <div className="dashboard-form-row">
                  <label>Quantidade atual<input required min="0" step="1" type="number" value={inventoryQuantity} onChange={(event) => setInventoryQuantity(event.target.value)} /></label>
                  <label>Quantidade mínima<input required min="0" step="1" type="number" value={inventoryMinimum} onChange={(event) => setInventoryMinimum(event.target.value)} /></label>
                </div>
                <button className="dashboard-button primary full-width" type="submit">Adicionar item</button>
              </form>
            )}
            {modal === 'goal' && (
              <form onSubmit={addGoal}>
                <label>Nome da meta<input required value={goalName} onChange={(event) => setGoalName(event.target.value)} placeholder="Ex.: Nova cadeira de tatuagem" /></label>
                <div className="dashboard-form-row">
                  <label>Valor alvo (R$)<input required min="0.01" step="0.01" type="number" value={goalTarget} onChange={(event) => setGoalTarget(event.target.value)} placeholder="0,00" /></label>
                  <label>Prazo<input required type="date" value={goalDeadline} onChange={(event) => setGoalDeadline(event.target.value)} /></label>
                </div>
                <button className="dashboard-button primary full-width" type="submit">Criar meta</button>
              </form>
            )}
            {modal === 'contribution' && (
              <form onSubmit={addContribution}>
                <p className="dashboard-modal-copy">Informe o valor para guardar nesta meta. Você também pode adicionar o valor rápido de R$ 100.</p>
                <label>Valor a adicionar (R$)<input required min="0.01" step="0.01" type="number" value={contributionAmount} onChange={(event) => setContributionAmount(event.target.value)} /></label>
                <button className="dashboard-button primary full-width" type="submit">Adicionar à meta</button>
                <button className="dashboard-button secondary full-width quick-contribution" type="button" onClick={() => {
                  if (contributionGoalId !== null) {
                    setGoals((current) => current.map((goal) => goal.id === contributionGoalId ? { ...goal, saved: goal.saved + 100 } : goal));
                  }
                  setModal(null);
                }}>Adicionar R$ 100</button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
