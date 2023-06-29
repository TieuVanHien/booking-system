import HomePage from '@/pages/home';
import RegisterPage from '@/pages/register';
export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <HomePage />
      <RegisterPage />
    </div>
  );
}
