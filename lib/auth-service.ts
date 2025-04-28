// This is a mock authentication service
// In a real app, you would use a proper authentication system

// Mock user data
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password", // In a real app, this would be hashed
  },
];

// Check if user is authenticated
export function isAuthenticated(): boolean {
  // In a real app, you would check for a valid session/token
  // For this demo, we'll just return true to simulate an authenticated user
  return true;
}

// Mock login function
export async function mockLogin(
  email: string,
  password: string
): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user exists and password matches
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // In a real app, you would set a session/token here
    localStorage.setItem(
      "user",
      JSON.stringify({ id: user.id, name: user.name, email: user.email })
    );
    return true;
  }

  // For demo purposes, allow login with any credentials
  if (email && password) {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: "demo", name: "Demo User", email })
    );
    return true;
  }

  return false;
}

// Mock signup function
export async function mockSignup(
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  password: string
): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user already exists
  const userExists = users.some((u) => u.email === email);

  if (userExists) {
    return false;
  }

  // In a real app, you would create a new user in the database
  // For this demo, we'll just simulate a successful signup
  localStorage.setItem("user", JSON.stringify({ id: "new-user", email }));

  return true;
}

// Mock logout function
export async function mockLogout(): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, you would invalidate the session/token
  localStorage.removeItem("user");

  return true;
}
