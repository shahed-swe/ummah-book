import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext'

class ErrorBoundary extends Component {
  state = { crashed: false };
  componentDidCatch() {
    // Clear corrupted localStorage and reload fresh
    ['ub_users','ub_user','ub_userid','ub_posts','ub_saved','ub_groups','ub_events'].forEach(k => localStorage.removeItem(k));
    this.setState({ crashed: true });
  }
  render() {
    if (this.state.crashed) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#f0fdf4', fontFamily:'sans-serif' }}>
          <div style={{ fontSize:48 }}>☪️</div>
          <h2 style={{ color:'#1a5c2a', marginTop:16 }}>UmmahBook</h2>
          <p style={{ color:'#555', marginTop:8 }}>Something went wrong. Reloading fresh...</p>
          <button onClick={() => window.location.reload()}
            style={{ marginTop:20, background:'#1a5c2a', color:'white', border:'none', borderRadius:12, padding:'10px 28px', fontSize:15, cursor:'pointer' }}>
            Reload · পুনরায় লোড করুন
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
)
