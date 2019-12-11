export const SET_MEALS = 'SET_MEALS';
export const UPDATE_MEAL = 'UPDATE_MEAL';
export const DELETE_MEAL = 'DELETE_MEAL';

export const SET_USER = 'SET_USER';

export const SET_MEMBER = 'SET_MEMBER';
export const SET_MEMBERS = 'SET_MEMBERS';
export const ADD_MEMBER = 'ADD_MEMBER';
export const DELETE_MEMBER = 'DELETE_MEMBER';

export const AUTH_USER = Object.freeze({
	START: 'AUTH_USER_START',
	FINISH: 'AUTH_USER_FINISH',
	ERROR: 'AUTH_USER_ERROR',
});
export const UNAUTH_USER = Object.freeze({
	START: 'UNAUTH_USER_START',
	FINISH: 'UNAUTH_USER_FINISH',
	ERROR: 'UNAUTH_USER_ERROR',
});
