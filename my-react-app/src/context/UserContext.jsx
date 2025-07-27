  import React, { createContext, useState, useEffect} from 'react';

  export const UserContext = createContext();

  export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

      const updateUser = (newUser) => {
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    };

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

    const login = (user) => {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
      setUser(null);
      localStorage.removeItem('user');
    };

    return (
      <UserContext.Provider value={{ user, login, logout, updateUser }}>
        {children}
      </UserContext.Provider>
    );
  }
