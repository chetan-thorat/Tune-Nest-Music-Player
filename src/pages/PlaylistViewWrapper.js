// src/pages/PlaylistViewWrapper.js
import React from 'react';
import { useParams } from 'react-router-dom';
import PlaylistView from '../components/PlaylistView';

const PlaylistViewWrapper = ({ type }) => {
  const { id } = useParams();

  return <PlaylistView trackId={id} />;
};

export default PlaylistViewWrapper;
