import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

import "./styles.css";
import { api } from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .userList()
      .then((data) => {
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Không tải được danh sách người dùng: {error.message}
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="body1">
        This is the user list, which takes up 3/12 of the window. You might
        choose to use <a href="https://mui.com/components/lists/">Lists</a>{" "}
        and <a href="https://mui.com/components/dividers/">Dividers</a> to
        display your users like so:
      </Typography>
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem>
              <Link to={`/users/${item._id}`}>
                <ListItemText primary={item.first_name} />
              </Link>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="body1">
        Dữ liệu lấy từ API <code>/user/list</code> qua <code>api.userList()</code>.
      </Typography>
    </div>
  );
}

export default UserList;
