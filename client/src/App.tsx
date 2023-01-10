import { useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import LoginForm from "./components/LoginForm";

function App() {
	const { store } = useContext(Context);

	useEffect(() => {
		if (localStorage.getItem("token")) {
			store.checkAuth();
		}
	}, [store]);

	async function getUsers() {
		try {
			await store.fetchUsers();
		} catch (error) {
			console.log(error);
		}
	}

	if (store.isLoading) {
		return <div>Loading...</div>;
	}
	if (!store.isAuth) {
		return (
			<div>
				<h1>Please authorize</h1>
				<LoginForm />
				<button onClick={getUsers}>Load all users</button>
			</div>
		);
	}

	return (
		<div className="App">
			<h1>{`User authorized ${store.user.email}`}</h1>

			<h2>
				{store.isAuth
					? "Accout successfully verified"
					: "Please verify your account! Confirmation email sended to your email."}
			</h2>
			<button onClick={() => store.logout()}>Logout</button>
			<div>
				<button onClick={getUsers}>Load all users</button>
				<ul>
					{store.allUsers.map(user => (
						<li key={user.email}>
							Email:{user.email}({user.isActivated ? "Verified" : "Not Verified"})
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default observer(App);
