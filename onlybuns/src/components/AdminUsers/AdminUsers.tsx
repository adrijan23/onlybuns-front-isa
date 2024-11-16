import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import axios from '../../config/axiosConfig';
import { useNavigate } from "react-router-dom";

// Define the structure of a user
interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

interface Post {
    posts: number;
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userPosts, setPosts] = useState<{ [key: number]: Post }>({});

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    const [searchFirstName, setSearchFirstName] = useState("");
    const [searchLastName, setSearchLastName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [minPostCount, setMinPostCount] = useState<number | null>(null);
    const [maxPostCount, setMaxPostCount] = useState<number | null>(null);

    const [sortColumn, setSortColumn] = useState<"posts" | "email" | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthContext is undefined!");

    const { auth } = authContext;
    const roles = auth.user?.roles;
    const navigate = useNavigate();


    const fetchUsers = async (page: number) => {
        try {
            const response = await axios.get(`http://localhost:8082/api/user/page`, {
                params: { page, size: pageSize }
            });
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError("Error fetching users. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        console.log(currentPage);
        const isAdmin = () => {
            return roles && roles.some(value => value.name === "ROLE_ADMIN");
        };

        if (!isAdmin()) {
            navigate("/");
            return;
        }

        fetchUsers(currentPage);
    }, [navigate, currentPage]);

    const fetchPosts = async (userId: number) => {
        try {
            const response = await axios.get<Post[]>(`http://localhost:8082/api/posts/${userId}`);
            setPosts(previous => ({
                ...previous,
                [userId]: {
                    posts: response.data.length,
                }
            }));
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setPosts(previous => ({
                    ...previous,
                    [userId]: {
                        posts: 0,
                    }
                }));
            } else {
                console.log("An error occured while fetching posts:", error);
            }
        }
    }

    useEffect(() => {
        if (users.length > 0) {
            users.forEach(user => fetchPosts(user.id));
        }
    }, [users]);

    const filteredUsers = users.filter(user => {
        const postCount = userPosts[user.id]?.posts ?? 0;
        const isWithinRange = (minPostCount === null || postCount >= minPostCount) &&
            (maxPostCount === null || postCount <= maxPostCount);

        return (
            user.firstName.toLowerCase().includes(searchFirstName.toLowerCase()) &&
            user.lastName.toLowerCase().includes(searchLastName.toLowerCase()) &&
            user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
            isWithinRange
        );
    });

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            console.log(newPage);
            setCurrentPage(newPage);
            console.log(currentPage);
        }
    }

    const sortUsers = (users: User[]) => {
        return [...users].sort((a, b) => {
            const postCountA = userPosts[a.id]?.posts ?? 0;
            const postCountB = userPosts[b.id]?.posts ?? 0;

            if (sortColumn === "posts") {
                if (sortDirection === "asc") {
                    return postCountA - postCountB;
                } else {
                    return postCountB - postCountA;
                }
            }

            if (sortColumn === "email") {
                if (sortDirection === "asc") {
                    return a.email.localeCompare(b.email);
                } else {
                    return b.email.localeCompare(a.email);
                }
            }

            return 0;
        })
    };

    const handleSort = (column: "posts" | "email") => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedUsers = sortUsers(filteredUsers);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Admin - User Management</h1>

            {/* Search Form */}
            <h2>Search by:</h2>
            <div>
                <input
                    type="text"
                    placeholder="First name"
                    value={searchFirstName}
                    onChange={(e) => setSearchFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last name"
                    value={searchLastName}
                    onChange={(e) => setSearchLastName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Min Post Count"
                    value={minPostCount ?? ""}
                    onChange={(e) => setMinPostCount(e.target.value ? parseInt(e.target.value) : null)}
                />
                <input
                    type="number"
                    placeholder="Max Post Count"
                    value={maxPostCount ?? ""}
                    onChange={(e) => setMaxPostCount(e.target.value ? parseInt(e.target.value) : null)}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>
                            <button onClick={() => handleSort("email")}>
                                Email {sortColumn === "email" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                            </button>
                        </th>
                        <th>
                            <button onClick={() => handleSort("posts")}>
                                Posts {sortColumn === "posts" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{userPosts[user.id]?.posts ?? 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div>
                <button onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}>
                    Previous
                </button>
                <span>Page  of </span>
                <button onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminUsers;