import * as RouteApiUtil from '../util/routes_api_util';
import merge from 'lodash/merge';
import {routeNormalizer, routesNormalizer} from '../util/normalizer';

export const RECEIVE_ROUTES = 'RECEIVE_ROUTES';
export const RECEIVE_ROUTE = 'RECEIVE_ROUTE';
export const REMOVE_ROUTE = 'REMOVE_ROUTE';
export const RECEIVE_ROUTE_ERRORS = 'RECEIVE_ROUTE_ERRORS';

export const receiveRoutes = (payload) => {
let normalizedPayload = routesNormalizer(payload.routes_by_id);
normalizedPayload = merge(
  normalizedPayload,
  {ordered_ids: payload.ordered_ids}
);
return {
    type: RECEIVE_ROUTES,
    payload: normalizedPayload
  };
};

export const receiveRoute = (payload) => {
  let normalizedPayload = routeNormalizer(payload.route);
  return {
    type: RECEIVE_ROUTE,
    payload: normalizedPayload
  };
};

export const removeRoute = (payload) => {
  return {
    type: REMOVE_ROUTE,
    payload
  };
};

export const receiveRouteErrors = (errors) => {
  return {
    type: RECEIVE_ROUTE_ERRORS,
    errors
  };
};

export const fetchRoutes = () => {
  return (dispatch) => {
    return RouteApiUtil.fetchRoutes().then(
      (payload) => dispatch(receiveRoutes(payload)),
      (errors) => dispatch(receiveRouteErrors(errors.responseJSON))
    );
  };
};

export const fetchRoute = (routeId) => {
  return (dispatch) => {
    return RouteApiUtil.fetchRoute(routeId).then(
      (payload) => dispatch(receiveRoute(payload)),
      (errors) => dispatch(receiveRouteErrors(errors.responseJSON))
    );
  };
};

export const createRoute = (route) => {
  return (dispatch) => {
    return RouteApiUtil.createRoute(route).then(
      (newRoute) => dispatch(receiveRoute(newRoute)),
      (errors) => dispatch(receiveRouteErrors(errors.responseJSON))
    );
  };
};

export const updateRoute = (route) => {
  return (dispatch) => {
    return RouteApiUtil.updateRoute(route).then(
      (updatedRoute) => dispatch(receiveRoute(updatedRoute)),
      (errors) => dispatch(receiveRouteErrors(errors.responseJSON))
    );
  };
};

export const deleteRoute = (routeId) => {
  return (dispatch) => {
    return RouteApiUtil.deleteRoute(routeId).then(
      (deletedRoute) => dispatch(removeRoute(deletedRoute)),
      (errors) => dispatch(receiveRouteErrors(errors.responseJSON))
    );
  };
};
