import { useNavigate } from "react-router-dom";
import NavigationBar from "../atoms/NavigationBar"
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import AppBar from "../atoms/AppBar"

type DefaultLayoutProps = {
  children: React.ReactNode
}


function DefaultLayout({ children }: DefaultLayoutProps) {
  const navigate = useNavigate();
 
  return (
    <div className="default-layout">
     <AppBar position="static" className="appBar">
        <h1>RECUR</h1>
      </AppBar>
      <main>{children}</main>
      <NavigationBar className="navigationBar" destinations={[
        { navigate: () => navigate('/'), label: "Recent", icon: <RestoreIcon /> },
        { navigate: () => navigate('/favorites'), label: "Favorites", icon: <FavoriteIcon /> },
        { navigate: () => navigate('/archive'), label: "Archive", icon: <ArchiveIcon /> },
      ]} />
    </div>
  )
}

export default DefaultLayout