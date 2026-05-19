import { Feather } from '@expo/vector-icons';

export default function TabBarIcon({ name, color, size = 20 }) {
  return <Feather name={name} size={size} color={color} />;
}