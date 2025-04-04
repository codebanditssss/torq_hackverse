import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { 
  Star, 
  Edit2, 
  Trash2, 
  Droplet, 
  Battery, 
  Truck, 
  Key 
} from 'lucide-react-native';
import { Review } from '@/types';

// Mock reviews
const mockReviews: (Review & { providerName: string, serviceType: string })[] = [
  {
    id: '1',
    userId: '1',
    providerId: '101',
    providerName: 'Quick Fuel Services',
    requestId: 'req1',
    rating: 5,
    comment: 'Excellent service! The fuel was delivered within 20 minutes and the provider was very professional.',
    createdAt: '2023-05-10T14:30:00Z',
    serviceType: 'fuel'
  },
  {
    id: '2',
    userId: '1',
    providerId: '102',
    providerName: 'Roadside Heroes',
    requestId: 'req2',
    rating: 4,
    comment: 'Good service, but took a bit longer than expected to arrive.',
    createdAt: '2023-04-22T10:15:00Z',
    serviceType: 'battery'
  },
  {
    id: '3',
    userId: '1',
    providerId: '103',
    providerName: 'SOS Auto Assist',
    requestId: 'req3',
    rating: 5,
    comment: 'Amazing service! They helped me with a flat tire in the middle of nowhere.',
    createdAt: '2023-03-15T18:45:00Z',
    serviceType: 'tire'
  }
];

export default function ReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState(mockReviews);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState(0);
  
  const handleEditReview = (review: Review) => {
    setEditingReview(review.id);
    setEditedComment(review.comment || '');
    setEditedRating(review.rating);
  };
  
  const handleSaveReview = (id: string) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === id 
          ? { ...review, comment: editedComment, rating: editedRating } 
          : review
      )
    );
    setEditingReview(null);
  };
  
  const handleDeleteReview = (id: string) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
          }
        }
      ]
    );
  };
  
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'fuel':
        return <Droplet size={20} color={colors.secondary} />;
      case 'battery':
        return <Battery size={20} color={colors.secondary} />;
      case 'tire':
      case 'tow':
        return <Truck size={20} color={colors.secondary}  />;
      case 'lockout':
        return <Key size={20} color={colors.secondary}  />;
      default:
        return <Droplet size={20} color={colors.secondary}  />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const renderStars = (rating: number, editable = false, onRatingChange?: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!editable}
            onPress={() => onRatingChange && onRatingChange(star)}
          >
            <Star
              size={20}
              color={star <= rating ? colors.secondary : colors.lightGray}
              fill={star <= rating ? colors.secondary : 'none'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Reviews" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Your Reviews</Text>
          
          {reviews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Star size={64} color={colors.lightGray} />
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptyDescription}>
                You haven't left any reviews for service providers yet.
              </Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.providerInfo}>
                    <View style={styles.serviceIconContainer}>
                      {getServiceIcon(review.serviceType)}
                    </View>
                    <View>
                      <Text style={styles.providerName}>{review.providerName}</Text>
                      <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                    </View>
                  </View>
                  
                  {editingReview !== review.id ? (
                    renderStars(review.rating)
                  ) : (
                    renderStars(editedRating, true, setEditedRating)
                  )}
                </View>
                
                {editingReview !== review.id ? (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                ) : (
                  <TextInput
                    style={styles.commentInput}
                    value={editedComment}
                    onChangeText={setEditedComment}
                    multiline
                    numberOfLines={3}
                    placeholder="Write your review here..."
                  />
                )}
                
                <View style={styles.reviewActions}>
                  {editingReview !== review.id ? (
                    <>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditReview(review)}
                      >
                        <Edit2 size={16} color={colors.primary} />
                        <Text style={styles.actionText}>Edit</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 size={16} color={colors.danger} />
                        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => setEditingReview(null)}
                      >
                        <Text style={[styles.actionText, styles.cancelText]}>Cancel</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={() => handleSaveReview(review.id)}
                      >
                        <Text style={[styles.actionText, styles.saveText]}>Save</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 8,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.gray,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.dark,
    marginBottom: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteText: {
    color: colors.danger,
  },
  cancelText: {
    color: colors.gray,
  },
  saveButton: {
    backgroundColor: colors.primary + '20',
    borderRadius: 4,
  },
  saveText: {
    color: colors.primary,
    marginLeft: 0,
  },
});