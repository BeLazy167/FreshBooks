import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Bill } from '~/types';
import { formatCurrency } from '~/utils';
import { Share } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';

interface BillDetailProps {
  bill: Bill;
}

export function BillDetail({ bill }: BillDetailProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generatePrintHTML = () => {
    const styles = `
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px;
        }
        .bill-info { 
          margin-bottom: 20px;
          border-bottom: 2px solid #eee;
          padding-bottom: 20px;
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0;
        }
        .items-table th, .items-table td { 
          padding: 12px; 
          text-align: left; 
          border-bottom: 1px solid #eee;
        }
        .items-table th { 
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .total-section { 
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #eee;
        }
        .total { 
          font-size: 18px; 
          font-weight: bold; 
          text-align: right;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
      </style>
    `;

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${styles}
        </head>
        <body>
          <div class="header">
            <h1>Bill Receipt</h1>
          </div>
          
          <div class="bill-info">
            <h2>${bill.providerName}</h2>
            <p>Date: ${new Date(bill.date).toLocaleDateString()}</p>
            <p>Receipt ID: ${bill.id || 'N/A'}</p>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.price.toString())}</td>
                  <td>${formatCurrency((item.quantity * Number(item.price)).toString())}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total">
              Total Amount: ${formatCurrency(bill.total)}
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);
      const shareMessage = `
Receipt from ${bill.providerName}
Date: ${new Date(bill.date).toLocaleDateString()}

Items:
${bill.items
  .map(
    (item) => `• ${item.name}
  ${item.quantity} × ${formatCurrency(item.price.toString())} = ${formatCurrency((item.quantity * Number(item.price)).toString())}`
  )
  .join('\n')}

Total Amount: ${formatCurrency(bill.total)}

Thank you for your business!`;

      const result = await Share.share({
        message: shareMessage,
        title: `Receipt - ${bill.providerName}`,
      });

      if (result.action === Share.sharedAction && result.activityType) {
        console.log('Shared with activity type:', result.activityType);
      }
    } catch (error) {
      Alert.alert(
        'Sharing Failed',
        'There was an error while sharing the receipt. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Share error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsLoading(true);
      const { uri } = await Print.printToFileAsync({
        html: generatePrintHTML(),
        base64: false,
      });

      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri);
      } else {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: 'View your receipt',
        });
      }
    } catch (error) {
      Alert.alert('Print Error', 'Failed to generate or share the PDF. Please try again.', [
        { text: 'OK' },
      ]);
      console.error('Print error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.providerInfo}>
            <View style={styles.iconContainer}>
              <Feather name="shopping-bag" size={24} color="#4299E1" />
            </View>
            <View>
              <Text style={styles.providerName}>{bill.providerName}</Text>
              <Text style={styles.date}>{new Date(bill.date).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>{formatCurrency(bill.total)}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.printButton]}
            onPress={handlePrint}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#4299E1" />
            ) : (
              <>
                <Feather name="printer" size={20} color="#4299E1" />
                <Text style={styles.buttonText}>Print Bill</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#4299E1" />
            ) : (
              <>
                <Feather name="share-2" size={20} color="#4299E1" />
                <Text style={styles.buttonText}>Share</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.itemsCard}>
          {bill.items.map((item, index) => (
            <View
              key={index}
              style={[styles.itemRow, index === bill.items.length - 1 && styles.lastItemRow]}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>
                  {item.quantity} × {formatCurrency(item.price.toString())}
                </Text>
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(item.item_total.toString())}</Text>
            </View>
          ))}

          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalAmount}>{formatCurrency(bill.total)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'black',
  
    padding: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EBF8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#718096',
  },
  section: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 16,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  itemsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  lastItemRow: {
    borderBottomWidth: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#718096',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 16,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  subtotalLabel: {
    fontSize: 16,
    color: '#718096',
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  totalSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  printButton: {
    backgroundColor: '#EBF8FF',
    borderColor: '#4299E1',
  },
  shareButton: {
    backgroundColor: '#EBF8FF',
    borderColor: '#4299E1',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4299E1',
  },
});
