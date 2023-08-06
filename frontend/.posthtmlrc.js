module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        MINIO_CONSOLE_URL: process.env.MINIO_CONSOLE_URL,
      },
    },
  },
};
