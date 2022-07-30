import { Html, Main, Head, NextScript } from 'next/document'
import { createGetInitialProps } from '@mantine/next'

const Document = () => {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main/>
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = createGetInitialProps()

export default Document
