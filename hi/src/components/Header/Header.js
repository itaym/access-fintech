import Head from 'next/head'
import Seo from '../../seo/Seo'
import { useTranslation } from 'next-i18next'

const Header = () => {
    const { t } = useTranslation()
    // noinspection HtmlRequiredTitleElement
    return (
        <Head>
            <meta httpEquiv="content-language" content={t('globals.locale')} />
            <Seo t={useTranslation('seo').t} />
        </Head>
    )
}

export default Header