module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/manifest.json'
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!\/__)/, /^\/[^\_]+\//, /^\/__\/auth\//],
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/**.js',
    'dist/**.css'
  ]
};