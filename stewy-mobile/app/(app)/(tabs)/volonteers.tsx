import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';

export default function VolonteersOverviewScreen() {
    const { t } = useTranslation()
    return (
        <ThemedView className='p-8'>
            <ThemedText type='h1'>{t('volonteers')}</ThemedText>
            <ThemedButton className='mt-4 self-start' label={t('click-here')} />
        </ThemedView>
    )
}