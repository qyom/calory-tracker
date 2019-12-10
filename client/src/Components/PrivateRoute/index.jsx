import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({
  isAuthenticated,
  fallbackPath,
  component: Component,
  render: originalRender,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        // console.log('props: ', props);
        // console.log('isAuthenticated: ', isAuthenticated);
        // console.log('props.location.pathname: ', props.location.pathname);
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: fallbackPath,
                state: { fromLocation: props.location }
              }}
            />
          );
        }

        if (Component) {
          return <Component {...props} />;
        } else if (originalRender) {
          return originalRender(props);
        }
      }}
    />
  );
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.elementType,
  render: PropTypes.func,
  fallbackPath: PropTypes.string.isRequired
};

function mapStateToProps({ user }) {
  return { isAuthenticated: !!user.data };
}

export default connect(mapStateToProps)(PrivateRoute);
