import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'plus': 'add',
  'calendar': 'event',
  'xmark': 'close',
  'person.2': 'group',
  'person': 'person',
  'clock': 'access-time',
  'mappin': 'place',
  'ellipsis': 'more-horiz',
  'info.circle': 'info',
  'person.crop.circle': 'account-circle',
  'person.crop.circle.fill': 'account-circle',
  'sportscourt': 'sports-soccer',
  'person.3': 'groups',
  'chart.bar': 'bar-chart',
  'soccerball': 'sports-soccer',
  'envelope': 'email',
  'lock': 'lock',
  'arrow.forward': 'arrow-forward',
  'arrow.backward': 'arrow-back',
  'person.badge.plus': 'person-add',
  'arrow.right.to.line': 'login',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'checkmark': 'check',
  'bell': 'notifications',
  'envelope.fill': 'email',
  'person.2.fill': 'group',
  'person.fill': 'person',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
