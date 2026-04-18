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

import { api } from "../../lib/fetchModelData";
import "./styles.css";

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
        if (!cancelled) {
          setUsers(Array.isArray(data) ? data : []);
        }
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
      <Box className="user-list-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" className="user-list-error">
        Không tải được danh sách người dùng: {error.message}
      </Typography>
    );
  }

  return (
    <Box className="user-list-root">
      <Typography variant="body2" className="user-list-intro">
        This is the user list, which takes up 3/12 of the window. You might
        choose to use <a href="https://mui.com/components/lists/">Lists</a>{" "}
        and <a href="https://mui.com/components/dividers/">Dividers</a> to
        display your users like so:
      </Typography>
      <List component="nav" dense className="user-list-nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem className="user-list-item">
              <Link to={`/users/${item._id}`} className="user-list-link">
                <ListItemText
                  primary={item.first_name || item.last_name}
                  primaryTypographyProps={{
                    noWrap: true,
                    className: "user-list-primary",
                  }}
                />
              </Link>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="caption" className="user-list-footer">
        Dữ liệu từ API <code>/user/list</code> qua <code>api.userList()</code>.
      </Typography>
    </Box>
  );
}

export default UserList;
