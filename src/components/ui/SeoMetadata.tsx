import Head from 'next/head'

interface SEOMetadataProps {
  title: string
  description: string
  canonicalUrl: string
  ogType?: string
}

const SEOMetadata: React.FC<SEOMetadataProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website'
}) => {
  const siteName = 'Portfoliogg'
  const twitterHandle = '@portfoliogg' // Replace with your actual Twitter handle
  const imageUrl = `${canonicalUrl}/portfoliogg.png`
  const ogimageUrl = `${canonicalUrl}/og-image-porfoliogg-geek-guys-studio`

  return (
    <Head>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph metadata */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogimageUrl} />
      <meta property="og:image:alt" content={`${siteName} logo`} />

      {/* Twitter Card metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogimageUrl} />
      <meta name="twitter:image:alt" content={`${siteName} logo`} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Android Chrome icons */}
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

      {/* Additional metadata */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />

      {/* PWA manifest */}
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  )
}

export default SEOMetadata