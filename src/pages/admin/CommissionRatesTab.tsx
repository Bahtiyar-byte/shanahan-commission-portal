import { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Save,
  Info,
  TrendingUp,
  Target,
  Award,
  Users,
  Building2,
  Truck,
  Package,
  Snowflake,
  Zap,
  Clock,
  Calendar,
  Layers,
  Calculator,
  ToggleLeft,
  Copy,
  AlertCircle,
} from 'lucide-react';

type CalculationMethod = 'percentage_of_revenue' | 'percentage_of_margin' | 'flat_rate' | 'tiered' | 'sliding_scale';
type TriggerEvent = 'on_payment' | 'on_delivery' | 'on_invoice' | 'manual';

interface CommissionTier {
  id: string;
  minRevenue: number;
  maxRevenue: number | null;
  rate: number;
}

interface CommissionRule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  calculationMethod: CalculationMethod;
  triggerEvent: TriggerEvent;
  baseRate: number;
  minRate: number;
  maxRate: number;
  tiers?: CommissionTier[];
  conditions?: string[];
  appliesTo: string[];
}

const defaultRules: CommissionRule[] = [
  {
    id: 'tl-sales',
    name: 'TL Sales Commission',
    description: 'Standard truckload sales commission',
    icon: <Truck className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'percentage_of_revenue',
    triggerEvent: 'on_payment',
    baseRate: 10,
    minRate: 8,
    maxRate: 12,
    appliesTo: ['salesperson'],
  },
  {
    id: 'ltl-sales',
    name: 'LTL Sales Commission',
    description: 'Less-than-truckload sales commission',
    icon: <Package className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'percentage_of_revenue',
    triggerEvent: 'on_payment',
    baseRate: 6,
    minRate: 5,
    maxRate: 8,
    appliesTo: ['salesperson'],
  },
  {
    id: 'csr-commission',
    name: 'CSR Commission',
    description: 'Customer service representative commission',
    icon: <Users className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'percentage_of_revenue',
    triggerEvent: 'on_payment',
    baseRate: 2.5,
    minRate: 2,
    maxRate: 3,
    appliesTo: ['csr'],
  },
  {
    id: 'intermodal',
    name: 'Intermodal Commission',
    description: 'Rail/truck intermodal shipments',
    icon: <Layers className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'percentage_of_margin',
    triggerEvent: 'on_payment',
    baseRate: 15,
    minRate: 12,
    maxRate: 20,
    appliesTo: ['salesperson'],
  },
  {
    id: 'expedited',
    name: 'Expedited/Hot Shot',
    description: 'Rush and time-critical shipments',
    icon: <Zap className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'percentage_of_revenue',
    triggerEvent: 'on_delivery',
    baseRate: 12,
    minRate: 10,
    maxRate: 15,
    appliesTo: ['salesperson'],
  },
  {
    id: 'reefer',
    name: 'Refrigerated/Reefer',
    description: 'Temperature-controlled shipments',
    icon: <Snowflake className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'percentage_of_revenue',
    triggerEvent: 'on_payment',
    baseRate: 11,
    minRate: 9,
    maxRate: 13,
    appliesTo: ['salesperson'],
  },
  {
    id: 'flatbed',
    name: 'Flatbed/Specialized',
    description: 'Flatbed and specialized equipment',
    icon: <Truck className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'percentage_of_margin',
    triggerEvent: 'on_payment',
    baseRate: 18,
    minRate: 15,
    maxRate: 22,
    appliesTo: ['salesperson'],
  },
  {
    id: 'manager-override',
    name: 'Manager Override',
    description: 'Override commission for sales managers',
    icon: <Award className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'percentage_of_revenue',
    triggerEvent: 'on_payment',
    baseRate: 2,
    minRate: 1,
    maxRate: 3,
    appliesTo: ['manager'],
  },
  {
    id: 'new-customer-bonus',
    name: 'New Customer Bonus',
    description: 'Bonus for acquiring new customers',
    icon: <Building2 className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'flat_rate',
    triggerEvent: 'on_payment',
    baseRate: 500,
    minRate: 250,
    maxRate: 1000,
    conditions: ['First load from new customer', 'Customer must complete 3 loads to qualify'],
    appliesTo: ['salesperson'],
  },
  {
    id: 'volume-tier',
    name: 'Volume Tiered Bonus',
    description: 'Graduated rates based on monthly revenue',
    icon: <TrendingUp className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'tiered',
    triggerEvent: 'on_payment',
    baseRate: 0,
    minRate: 0,
    maxRate: 3,
    tiers: [
      { id: 't1', minRevenue: 0, maxRevenue: 50000, rate: 0 },
      { id: 't2', minRevenue: 50000, maxRevenue: 100000, rate: 0.5 },
      { id: 't3', minRevenue: 100000, maxRevenue: 200000, rate: 1 },
      { id: 't4', minRevenue: 200000, maxRevenue: 500000, rate: 2 },
      { id: 't5', minRevenue: 500000, maxRevenue: null, rate: 3 },
    ],
    appliesTo: ['salesperson'],
  },
  {
    id: 'tenure-bonus',
    name: 'Tenure Bonus',
    description: 'Additional commission based on years of service',
    icon: <Calendar className="w-5 h-5" />,
    isActive: false,
    calculationMethod: 'tiered',
    triggerEvent: 'on_payment',
    baseRate: 0,
    minRate: 0,
    maxRate: 2,
    tiers: [
      { id: 't1', minRevenue: 0, maxRevenue: 1, rate: 0 },
      { id: 't2', minRevenue: 1, maxRevenue: 3, rate: 0.5 },
      { id: 't3', minRevenue: 3, maxRevenue: 5, rate: 1 },
      { id: 't4', minRevenue: 5, maxRevenue: null, rate: 2 },
    ],
    appliesTo: ['salesperson', 'csr'],
  },
  {
    id: 'performance-multiplier',
    name: 'Performance Multiplier',
    description: 'Multiply commission based on performance score',
    icon: <Target className="w-5 h-5" />,
    isActive: true,
    calculationMethod: 'sliding_scale',
    triggerEvent: 'on_payment',
    baseRate: 1,
    minRate: 0.8,
    maxRate: 1.25,
    conditions: ['Score 80+: 1.1x multiplier', 'Score 90+: 1.25x multiplier', 'Score <60: 0.8x multiplier'],
    appliesTo: ['salesperson'],
  },
  {
    id: 'quick-pay-bonus',
    name: 'Quick Collection Bonus',
    description: 'Bonus for loads paid within 15 days',
    icon: <Clock className="w-5 h-5" />,
    isActive: false,
    calculationMethod: 'flat_rate',
    triggerEvent: 'on_payment',
    baseRate: 25,
    minRate: 10,
    maxRate: 50,
    conditions: ['Payment received within 15 days of delivery', 'Invoice amount > $1,000'],
    appliesTo: ['salesperson', 'csr'],
  },
];

const calculationMethodLabels: Record<CalculationMethod, { label: string; description: string }> = {
  percentage_of_revenue: { label: 'Percentage of Revenue', description: 'Commission based on total billed amount' },
  percentage_of_margin: { label: 'Percentage of Margin', description: 'Commission based on profit margin' },
  flat_rate: { label: 'Flat Rate', description: 'Fixed dollar amount per load/event' },
  tiered: { label: 'Tiered', description: 'Graduated rates based on volume thresholds' },
  sliding_scale: { label: 'Sliding Scale', description: 'Multiplier based on performance metrics' },
};

const triggerEventLabels: Record<TriggerEvent, string> = {
  on_payment: 'On Payment Received',
  on_delivery: 'On Delivery Confirmed',
  on_invoice: 'On Invoice Generated',
  manual: 'Manual Trigger',
};

export function CommissionRatesTab() {
  const [rules, setRules] = useState<CommissionRule[]>(defaultRules);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [showAddRule, setShowAddRule] = useState(false);

  const handleToggleActive = (ruleId: string) => {
    setRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<CommissionRule>) => {
    setRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, ...updates } : r
    ));
  };

  const handleAddTier = (ruleId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id !== ruleId) return r;
      const lastTier = r.tiers?.[r.tiers.length - 1];
      const newTier: CommissionTier = {
        id: `t${(r.tiers?.length || 0) + 1}`,
        minRevenue: lastTier?.maxRevenue || 0,
        maxRevenue: null,
        rate: 0,
      };
      return { ...r, tiers: [...(r.tiers || []), newTier] };
    }));
  };

  const activeRules = rules.filter(r => r.isActive).length;
  const totalRules = rules.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commission Rates</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure commission calculation rules and rates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddRule(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E8F5E9] rounded-lg">
              <Calculator className="w-5 h-5 text-[#1B7340]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalRules}</p>
              <p className="text-xs text-gray-500">Total Rules</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ToggleLeft className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeRules}</p>
              <p className="text-xs text-gray-500">Active Rules</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rules.filter(r => r.calculationMethod === 'tiered').length}</p>
              <p className="text-xs text-gray-500">Tiered Rules</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rules.filter(r => r.name.includes('Bonus')).length}</p>
              <p className="text-xs text-gray-500">Bonus Rules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">How Commission Rules Work</p>
          <p className="text-xs text-blue-700 mt-1">
            Rules are applied in order. Base commissions are calculated first, then bonuses and multipliers are applied.
            Tiered rules stack - if a salesperson qualifies for multiple tiers, they receive the rate for each tier they exceed.
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white rounded-xl border transition-all ${
              expandedRule === rule.id
                ? 'border-[#1B7340] shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            } ${!rule.isActive ? 'opacity-60' : ''}`}
          >
            {/* Rule Header */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
            >
              <div className="flex items-center gap-4">
                {/* Expand Icon */}
                <div className="text-gray-400">
                  {expandedRule === rule.id
                    ? <ChevronDown className="w-5 h-5" />
                    : <ChevronRight className="w-5 h-5" />
                  }
                </div>

                {/* Icon */}
                <div className={`p-2.5 rounded-lg ${rule.isActive ? 'bg-[#E8F5E9] text-[#1B7340]' : 'bg-gray-100 text-gray-400'}`}>
                  {rule.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      rule.calculationMethod === 'percentage_of_revenue' ? 'bg-green-100 text-green-700' :
                      rule.calculationMethod === 'percentage_of_margin' ? 'bg-blue-100 text-blue-700' :
                      rule.calculationMethod === 'flat_rate' ? 'bg-purple-100 text-purple-700' :
                      rule.calculationMethod === 'tiered' ? 'bg-orange-100 text-orange-700' :
                      'bg-pink-100 text-pink-700'
                    }`}>
                      {calculationMethodLabels[rule.calculationMethod].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{rule.description}</p>
                </div>

                {/* Rate Display */}
                <div className="text-right">
                  {rule.calculationMethod === 'flat_rate' ? (
                    <p className="text-lg font-bold text-gray-900">${rule.baseRate}</p>
                  ) : rule.calculationMethod === 'sliding_scale' ? (
                    <p className="text-lg font-bold text-gray-900">{rule.minRate}x - {rule.maxRate}x</p>
                  ) : rule.calculationMethod === 'tiered' ? (
                    <p className="text-lg font-bold text-gray-900">Up to {rule.maxRate}%</p>
                  ) : (
                    <p className="text-lg font-bold text-gray-900">{rule.minRate}% - {rule.maxRate}%</p>
                  )}
                  <p className="text-xs text-gray-500">{triggerEventLabels[rule.triggerEvent]}</p>
                </div>

                {/* Toggle */}
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleToggleActive(rule.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      rule.isActive ? 'bg-[#1B7340]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        rule.isActive ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedRule === rule.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Settings */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Configuration</h5>

                    {/* Calculation Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
                      <select
                        value={rule.calculationMethod}
                        onChange={(e) => handleUpdateRule(rule.id, { calculationMethod: e.target.value as CalculationMethod })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm bg-white"
                      >
                        {Object.entries(calculationMethodLabels).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">{calculationMethodLabels[rule.calculationMethod].description}</p>
                    </div>

                    {/* Trigger Event */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Event</label>
                      <select
                        value={rule.triggerEvent}
                        onChange={(e) => handleUpdateRule(rule.id, { triggerEvent: e.target.value as TriggerEvent })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm bg-white"
                      >
                        {Object.entries(triggerEventLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Rate Configuration */}
                    {rule.calculationMethod !== 'tiered' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {rule.calculationMethod === 'flat_rate' ? 'Amount' :
                           rule.calculationMethod === 'sliding_scale' ? 'Multiplier Range' :
                           'Rate Range'}
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500">
                              {rule.calculationMethod === 'flat_rate' ? 'Base Amount' : 'Minimum'}
                            </label>
                            <div className="relative mt-1">
                              {rule.calculationMethod === 'flat_rate' && (
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              )}
                              <input
                                type="number"
                                value={rule.calculationMethod === 'flat_rate' ? rule.baseRate : rule.minRate}
                                onChange={(e) => handleUpdateRule(rule.id, {
                                  [rule.calculationMethod === 'flat_rate' ? 'baseRate' : 'minRate']: Number(e.target.value)
                                })}
                                className={`w-full ${rule.calculationMethod === 'flat_rate' ? 'pl-7' : 'pl-4'} pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm`}
                              />
                              {rule.calculationMethod !== 'flat_rate' && rule.calculationMethod !== 'sliding_scale' && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                              )}
                              {rule.calculationMethod === 'sliding_scale' && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">x</span>
                              )}
                            </div>
                          </div>
                          {rule.calculationMethod !== 'flat_rate' && (
                            <>
                              <span className="text-gray-400 pt-5">to</span>
                              <div className="flex-1">
                                <label className="text-xs text-gray-500">Maximum</label>
                                <div className="relative mt-1">
                                  <input
                                    type="number"
                                    value={rule.maxRate}
                                    onChange={(e) => handleUpdateRule(rule.id, { maxRate: Number(e.target.value) })}
                                    className="w-full pl-4 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent text-sm"
                                  />
                                  {rule.calculationMethod !== 'sliding_scale' && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                  )}
                                  {rule.calculationMethod === 'sliding_scale' && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">x</span>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tiered Configuration */}
                    {rule.calculationMethod === 'tiered' && rule.tiers && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Volume Tiers</label>
                          <button
                            onClick={() => handleAddTier(rule.id)}
                            className="text-xs text-[#1B7340] hover:text-[#155c33] font-medium flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Tier
                          </button>
                        </div>
                        <div className="space-y-2">
                          {rule.tiers.map((tier, index) => (
                            <div key={tier.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                              <span className="text-xs text-gray-500 w-8">T{index + 1}</span>
                              <input
                                type="number"
                                value={tier.minRevenue}
                                placeholder="Min"
                                className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                              <span className="text-gray-400">-</span>
                              <input
                                type="number"
                                value={tier.maxRevenue || ''}
                                placeholder="No max"
                                className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                              <span className="text-gray-400">=</span>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={tier.rate}
                                  className="w-16 px-2 py-1.5 pr-6 border border-gray-300 rounded text-sm"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">%</span>
                              </div>
                              <button className="p-1 text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Applies To */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Applies To</label>
                      <div className="flex flex-wrap gap-2">
                        {['salesperson', 'manager', 'csr', 'accounting'].map(role => (
                          <label key={role} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={rule.appliesTo.includes(role)}
                              onChange={(e) => {
                                const newAppliesTo = e.target.checked
                                  ? [...rule.appliesTo, role]
                                  : rule.appliesTo.filter(r => r !== role);
                                handleUpdateRule(rule.id, { appliesTo: newAppliesTo });
                              }}
                              className="rounded border-gray-300 text-[#1B7340] focus:ring-[#1B7340]"
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">{role}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Conditions & Preview */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Conditions & Preview</h5>

                    {/* Conditions */}
                    {rule.conditions && rule.conditions.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Conditions</p>
                            <ul className="mt-1 space-y-1">
                              {rule.conditions.map((condition, i) => (
                                <li key={i} className="text-xs text-yellow-700 flex items-start gap-1">
                                  <span className="text-yellow-500">•</span>
                                  {condition}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Example Calculation */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Example Calculation</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Load Revenue:</span>
                          <span className="font-medium">$5,000</span>
                        </div>
                        {rule.calculationMethod === 'percentage_of_margin' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Margin (assumed 20%):</span>
                            <span className="font-medium">$1,000</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rate Applied:</span>
                          <span className="font-medium">
                            {rule.calculationMethod === 'flat_rate' ? `$${rule.baseRate}` :
                             rule.calculationMethod === 'sliding_scale' ? `${rule.baseRate}x multiplier` :
                             `${rule.baseRate}%`}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between">
                          <span className="text-gray-700 font-medium">Commission:</span>
                          <span className="font-bold text-[#1B7340]">
                            ${rule.calculationMethod === 'flat_rate' ? rule.baseRate :
                              rule.calculationMethod === 'percentage_of_margin' ? (1000 * rule.baseRate / 100).toFixed(2) :
                              rule.calculationMethod === 'sliding_scale' ? (500 * rule.baseRate).toFixed(2) :
                              (5000 * rule.baseRate / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                        <Copy className="w-4 h-4" />
                        Duplicate Rule
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] text-sm font-medium">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Global Save */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] font-medium">
          <Save className="w-5 h-5" />
          Save All Changes
        </button>
      </div>

      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[500px] max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add Commission Rule</h3>
              <button onClick={() => setShowAddRule(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="e.g., New Customer Bonus" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent" placeholder="Brief description of the rule" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent bg-white">
                  {Object.entries(calculationMethodLabels).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Event</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7340] focus:border-transparent bg-white">
                  {Object.entries(triggerEventLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowAddRule(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#1B7340] text-white rounded-lg hover:bg-[#155c33] font-medium">
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
