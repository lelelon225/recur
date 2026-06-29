
type DefaultLayoutProps = {
  children: React.ReactNode
}


function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="default-layout">
      <header>
        <h1>Default Layout Header</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>Default Layout Footer</p>
      </footer>
    </div>
  )
}

export default DefaultLayout