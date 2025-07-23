import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Test the route: http://localhost:${PORT}/api/landing/courses`);
  console.log(`🔗 Test route: http://localhost:${PORT}/api/test-route`);
});