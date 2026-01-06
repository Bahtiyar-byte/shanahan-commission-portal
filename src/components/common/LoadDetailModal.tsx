import { MapPin, Calendar, DollarSign, Clock, Flag, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';
import { StatusPill } from './StatusPill';
import { ScoreBadge } from './ScoreBadge';
import { NotesList } from './NotesList';
import type { Load } from '../../types';
import { getCustomerById } from '../../data/mockData';

interface LoadDetailModalProps {
  load: Load | null;
  isOpen: boolean;
  onClose: () => void;
  showAllCommissions?: boolean; // Only true for admin view
}

export function LoadDetailModal({ load, isOpen, onClose, showAllCommissions = false }: LoadDetailModalProps) {
  if (!load) return null;

  const customer = getCustomerById(load.customerId);
  const outstandingAmount = load.billedAmount - load.receivedAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Load #${load.loadNumber}`} size="lg">
      <div className="p-6 space-y-6">
        {/* Header Info */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{load.customerName}</h3>
              {customer && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Trust Score:</span>
                  <ScoreBadge score={customer.trustScore} size="sm" />
                </div>
              )}
            </div>
            <StatusPill status={load.status} />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Assigned to</p>
            <p className="font-medium text-gray-900">{load.salespersonName}</p>
          </div>
        </div>

        {/* Route Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                Origin
              </div>
              <p className="font-medium text-gray-900">{load.origin}</p>
            </div>
            <div className="text-gray-300 text-2xl">→</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                Destination
              </div>
              <p className="font-medium text-gray-900">{load.destination}</p>
            </div>
          </div>
          <div className="flex gap-8 mt-4 pt-4 border-t border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                Pickup
              </div>
              <p className="font-medium text-gray-900">{formatDate(load.pickupDate)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                Delivery
              </div>
              <p className="font-medium text-gray-900">{formatDate(load.deliveryDate)}</p>
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <DollarSign className="w-4 h-4" />
              Billed Amount
            </div>
            <p className="text-lg font-semibold text-gray-900 tabular-nums">
              {formatCurrency(load.billedAmount)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <CheckCircle className="w-4 h-4" />
              Received
            </div>
            <p className="text-lg font-semibold text-green-600 tabular-nums">
              {formatCurrency(load.receivedAmount)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              Outstanding
            </div>
            <p className={`text-lg font-semibold tabular-nums ${outstandingAmount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(outstandingAmount)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              Days Outstanding
            </div>
            <p className={`text-lg font-semibold tabular-nums ${load.daysOutstanding > 30 ? 'text-red-600' : load.daysOutstanding > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
              {load.daysOutstanding > 0 ? load.daysOutstanding : '-'}
            </p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="text-sm text-gray-500">
          Invoice Date: <span className="text-gray-900">{formatDate(load.invoiceDate)}</span>
        </div>

        {/* Commission Breakdown */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Commission Breakdown</h4>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Recipient</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Rate</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {(showAllCommissions ? load.commissionRecipients : load.commissionRecipients.slice(0, 1)).map((recipient) => (
                <tr key={recipient.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{recipient.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{recipient.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right tabular-nums">{recipient.rate}%</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right tabular-nums">
                    {formatCurrency(recipient.calculated)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      recipient.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {recipient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes Section */}
        <NotesList notes={load.notes} onAddNote={(content) => console.log('New note:', content)} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2c4f7a] transition-colors text-sm font-medium">
            <Flag className="w-4 h-4" />
            Flag for Dispute
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Mark Resolved
          </button>
        </div>
      </div>
    </Modal>
  );
}
