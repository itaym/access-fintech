import Document, { Head, Html, Main, NextScript } from 'next/document'
import Seo from '../src/seo/Seo'

class MyDocument extends Document {

    static async getInitialProps (ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render () {
        // noinspection HtmlRequiredTitleElement
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument