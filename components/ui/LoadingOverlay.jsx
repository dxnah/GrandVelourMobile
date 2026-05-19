import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function LoadingOverlay() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator color={Colors.gold} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,13,13,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
});