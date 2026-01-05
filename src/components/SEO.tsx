import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    type?: 'website' | 'article' | 'product';
    name?: string;
    image?: string;
    url?: string;
    schema?: Record<string, any>;
}

export const SEO = ({
    title,
    description,
    type = 'website',
    name,
    image,
    url,
    schema
}: SEOProps) => {
    const siteName = 'Thulirkal';
    const currentUrl = url || window.location.href;
    const defaultImage = 'https://thulirkal.com/logo.png';
    const metaImage = image || defaultImage;

    return (
        <Helmet>
            {/* Basic Metadata */}
            <title>{title} | {siteName}</title>
            <meta name='description' content={description} />

            {/* OpenGraph / Facebook */}
            <meta property='og:type' content={type} />
            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:url' content={currentUrl} />
            <meta property='og:site_name' content={siteName} />
            <meta property='og:image' content={metaImage} />

            {/* Twitter */}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:creator' content='@thulirkal' />
            <meta name='twitter:title' content={title} />
            <meta name='twitter:description' content={description} />
            <meta name='twitter:image' content={metaImage} />

            {/* JSON-LD Structured Data */}
            {schema && (
                <script type='application/ld+json'>
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};
