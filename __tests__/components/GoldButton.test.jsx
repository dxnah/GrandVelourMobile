import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GoldButton from '../../components/ui/GoldButton';

describe('GoldButton', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<GoldButton title="Book Now" onPress={() => {}} />);
    expect(getByText('Book Now')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<GoldButton title="Book Now" onPress={mockPress} />);
    fireEvent.press(getByText('Book Now'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<GoldButton title="Book Now" onPress={mockPress} disabled />);
    fireEvent.press(getByText('Book Now'));
    expect(mockPress).not.toHaveBeenCalled();
  });
});