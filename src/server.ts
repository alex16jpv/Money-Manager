import app from "./app";

const PORT = process.env.PORT || 5000;

app().then((app) => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
