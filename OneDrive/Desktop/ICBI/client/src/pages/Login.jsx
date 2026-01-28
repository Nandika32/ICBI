import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('researcher');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-medic-200">
                <h2 className="text-2xl font-bold text-center mb-6 text-medic-800">Welcome Back</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <div className="flex bg-medic-100 rounded-lg p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('researcher')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === 'researcher' ? 'bg-white text-primary-600 shadow-sm' : 'text-medic-600 hover:text-medic-800'}`}
                    >
                        Researcher
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('hospital')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === 'hospital' ? 'bg-white text-primary-600 shadow-sm' : 'text-medic-600 hover:text-medic-800'}`}
                    >
                        Hospital
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-medic-500">
                    Don't have an account? <Link to="/register" className="text-primary-600 hover:underline">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
