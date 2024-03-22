import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen xl:py-20 lg:bg-[url(https://images.pexels.com/photos/6485437/pexels-photo-6485437.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)]`}
    >
      <div
        className='w-full 
      xl:max-w-5xl
      2xl:max-w-7xl mx-auto relative'
      >
        <Navbar />
        <div className='bg-white'>{children}</div>
        <Footer className='bg-white' />
      </div>
    </div>
  );
}
