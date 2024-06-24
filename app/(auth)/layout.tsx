


const Layout = ({children}: Readonly<{children: React.ReactNode}>)=>
 {
  return (
    <main className='auth'>
         {children}
    </main>
  );
}

export default Layout;
