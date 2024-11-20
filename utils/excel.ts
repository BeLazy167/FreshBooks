import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import type { Bill } from '~/types';

export async function exportBillsToExcel(
  bills: Bill[],
  filters: {
    providerId: string;
    signerId: string;
    startDate: string | null;
    endDate: string | null;
  }
) {
  // First apply filters to get the correct dataset
  const filteredBills = bills.filter((bill) => {
    // Provider filter
    if (filters.providerId && bill.providerId !== filters.providerId) {
      return false;
    }

    // Signer filter
    if (filters.signerId && bill.signer !== filters.signerId) {
      return false;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const billDate = new Date(bill.date);
      const startDateObj = filters.startDate ? new Date(filters.startDate) : null;
      const endDateObj = filters.endDate ? new Date(filters.endDate) : null;

      if (startDateObj && endDateObj) {
        return isWithinInterval(billDate, {
          start: startOfDay(startDateObj),
          end: endOfDay(endDateObj),
        });
      }

      if (startDateObj && billDate < startOfDay(startDateObj)) {
        return false;
      }

      if (endDateObj && billDate > endOfDay(endDateObj)) {
        return false;
      }
    }

    return true;
  });

  // Calculate totals
  const totalAmount = filteredBills.reduce((sum, bill) => sum + Number(bill.total), 0);

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create Bills sheet with filtered data
  const wsData = filteredBills.map((bill) => ({
    Date: format(new Date(bill.date), 'dd/MM/yyyy'),
    Provider: bill.providerName,
    Signer: bill.signer,
    Items: bill.items
      .map((item) => `• ${item.name}\n  Qty: ${item.quantity} × $${Number(item.price).toFixed(2)}`)
      .join('\n\n'),
    'Amount ($)': Number(bill.total).toFixed(2),
  }));

  const ws = XLSX.utils.json_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // Date
    { wch: 30 }, // Provider
    { wch: 20 }, // Signer
    { wch: 70 }, // Items
    { wch: 18 }, // Amount
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Bills');

  // Process summary data with proper number handling
  const providerSummary = filteredBills.reduce(
    (acc, bill) => {
      const provider = bill.providerName;
      acc[provider] = (acc[provider] || 0) + Number(bill.total);
      return acc;
    },
    {} as Record<string, number>
  );

  const signerSummary = filteredBills.reduce(
    (acc, bill) => {
      const signer = bill.signer;
      acc[signer] = (acc[signer] || 0) + Number(bill.total);
      return acc;
    },
    {} as Record<string, number>
  );

  // Create summary data with proper number formatting
  const summaryData = [
    ['Bills Summary Report'],
    [],
    ['Report Generated:', format(new Date(), 'dd/MM/yyyy HH:mm')],
    [],
    ['Filter Criteria'],
    [
      'Date Range:',
      filters.startDate ? format(new Date(filters.startDate), 'dd/MM/yyyy') : 'All',
      'to',
      filters.endDate ? format(new Date(filters.endDate), 'dd/MM/yyyy') : 'All',
    ],
    [
      'Provider:',
      filteredBills.find((b) => b.providerId === filters.providerId)?.providerName || 'All',
    ],
    ['Signer:', filters.signerId || 'All'],
    [],
    ['Summary Statistics'],
    ['Total Bills:', filteredBills.length],
    ['Total Amount:', '', '', `$${totalAmount.toFixed(2)}`],
    [],
    ['Provider-wise Summary'],
    ['Provider', 'Number of Bills', 'Total Amount ($)'],
    ...Object.entries(providerSummary).map(([provider, amount]) => [
      provider,
      filteredBills.filter((b) => b.providerName === provider).length,
      `$${amount.toFixed(2)}`,
    ]),
    [],
    ['Signer-wise Summary'],
    ['Signer', 'Number of Bills', 'Total Amount ($)'],
    ...Object.entries(signerSummary).map(([signer, amount]) => [
      signer,
      filteredBills.filter((b) => b.signer === signer).length,
      `$${amount.toFixed(2)}`,
    ]),
  ];

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);

  // Set column widths for summary
  summaryWs['!cols'] = [{ wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 20 }];

  // Add sheet to workbook
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Convert workbook to array buffer
  const wbout = XLSX.write(wb, {
    type: 'base64',
    bookType: 'xlsx',
    bookSST: false,
  });

  // Save and share file
  const fileName = `bills_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  try {
    await FileSystem.writeAsStringAsync(filePath, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists || fileInfo.size === 0) {
      throw new Error('File was not created properly');
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Download Bills Report',
        UTI: 'com.microsoft.excel.xlsx',
      });

      await FileSystem.deleteAsync(filePath, { idempotent: true });
    }
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export Excel file');
  }
}
