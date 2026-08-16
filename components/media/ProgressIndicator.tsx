import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressIndicatorProps {
  watchedCount: number;
  totalCount: number;
  compact?: boolean;
}

export default function ProgressIndicator({
  watchedCount,
  totalCount,
  compact = false
}: ProgressIndicatorProps) {
  const percentage = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%` }
          ]}
        />
      </View>
      {!compact && (
        <Text style={styles.progressText}>
          {watchedCount}/{totalCount} episodes
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
});
