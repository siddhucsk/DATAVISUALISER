// NOTE: Tailwind CSS v4 requires a specific setup
module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(),
    require('autoprefixer')
  ]
} 