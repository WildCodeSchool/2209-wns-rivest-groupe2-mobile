import React, { useState, useContext, useEffect, useMemo } from "react";
import { View, Image, Text, Button, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { rateNumbers } from "../../types/IComment";
import { useMutation, useQuery } from '@apollo/client';
import { COMMENT_POI_MUTATION, DELETE_COMMENT, UPDATE_COMMENT_POI_MUTATION } from "../../services/mutations/comment";
import { useRecoilValue } from "recoil";
import { userState } from "../../atom/userAtom";
import { GET_COMMENTS_NUMBER_PER_POI, GET_POI_BY_ID, GET_POI_QUERY, GET_USER_COMMENT_POI_QUERY } from "../../services/queries/Poi";
import tw from 'tailwind-react-native-classnames';


const CommentScreen = ({ route }) => {
  const [rating, setRating] = useState<rateNumbers>(rateNumbers.FOUR);
  const [comment, setComment] = useState('');
  const user = useRecoilValue(userState);
  const [isEditing, setIsEditing] = useState(false);

  const { poiId } = route.params;

  const { data: poiData, loading: poiLoading } = useQuery(GET_POI_BY_ID, {
    variables: { getPoIbyIdId: poiId },
    }
  );

  const { loading: userCommentLoading, data: userCommentData } = useQuery(
    GET_USER_COMMENT_POI_QUERY,
    {
      variables: { userId: user.userFromDB.id, poiId },
    }
  );

  const userComment = useMemo(() => {
    if (!poiData) return null;
    return poiData.getPOIbyId.comments.find(comment => comment.user.id === user.userFromDB.id);
  }, [poiData, user.userFromDB.id]);

  const otherComments = useMemo(() => {
    if (!poiData) return [];
    return poiData.getPOIbyId.comments.filter(comment => comment.user.id !== user.userFromDB.id);
  }, [poiData, user.userFromDB.id]);

  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [commentPOI] = useMutation(COMMENT_POI_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      },
      refetchQueries: [
        { query: GET_POI_QUERY },
        { query: GET_COMMENTS_NUMBER_PER_POI, variables: { poiId } },
      ],
    });

    const [updateComment, { loading: updateLoading }] = useMutation(UPDATE_COMMENT_POI_MUTATION, {
      context: {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      },
      refetchQueries: [
        { query: GET_POI_QUERY },
        { query: GET_COMMENTS_NUMBER_PER_POI, variables: { poiId } },
      ],
    });

    const handleUpdateComment = async () => {
      try {
        await updateComment({
          variables: {
            commentId: userComment.id, 
            comment: comment,
            rate: rating,
            userId: user.userFromDB.id,
            poiId: poiId,
          }
        });
        setIsEditing(false);
      } catch (error) {
        Alert.alert(`Failed to update comment: ${error.message}`);
      }
    };

  const handleDeleteComment = async () => {
    try {
      await deleteComment({ variables: { commentId: userComment.id } });
    } catch (error) {
      Alert.alert(`Failed to delete comment: ${error.message}`);
    }
  };

  const handleAddComment = async () => {
    try {

      await commentPOI({
        variables: {
          poiId: poiId,
          userId: user.userFromDB.id,
          comment: comment,
          rate: rating
        }
      });
    } catch (error) {
      Alert.alert(`Failed to add comment: ${error.message}`);
    }
  };

  useEffect(() => {
    if(userCommentData) {
      setComment(userCommentData.comment);
      setRating(userCommentData.rating);
    }
  }, [userCommentData]);

  if (userCommentLoading || poiLoading || updateLoading) {
    return <ActivityIndicator />;
  }

  const renderStars = (rating) => {
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += '⭐';
    }
    return stars;
  };


  

  return (
    <View style={tw`p-4 mt-4`}>
      {userComment ? (
        <>
          <Text style={tw`text-lg font-bold mb-2`}>Ton commentaire :</Text>
          {isEditing ? (
            <>
              <TextInput 
                style={tw`border border-gray-500 rounded p-2 mb-2`}
                multiline 
                numberOfLines={2} 
                onChangeText={text => setComment(text)} 
                value={comment} 
              />
              <Text style={tw`text-lg font-bold mb-2`}>Ta note</Text>
              <Picker
                selectedValue={rating}
                onValueChange={(itemValue, itemIndex) => setRating(itemValue)}
                style={tw`mb-2`}
              >
                <Picker.Item label="1" value={rateNumbers.ONE} />
                <Picker.Item label="2" value={rateNumbers.TWO} />
                <Picker.Item label="3" value={rateNumbers.THREE} />
                <Picker.Item label="4" value={rateNumbers.FOUR} />
                <Picker.Item label="5" value={rateNumbers.FIVE} />
              </Picker>
              <View style={tw`mt-2`}>
                <Button title="Sauvegarder" onPress={handleUpdateComment} />
              </View>
              <View style={tw`mt-2`}>
                <Button title="Annuler" onPress={() => setIsEditing(false)} />
              </View>
            </>
          ) : (
            <>
              <Text>{renderStars(userComment.rate)}</Text>
              <Text style={tw`text-base mb-2`}>{userComment.text}</Text>
              <View style={tw`mt-2`}>
              <Button title="Modifier" onPress={() => {
                setIsEditing(true);
                setComment(userComment.text);
                setRating(userComment.rate);
              }} />              
              </View>
            </>
          )}
        </>
      ) : (
        <>
          <Text style={tw`text-lg font-bold mb-2`}>Donner une note:</Text>
          <Picker
            selectedValue={rating}
            onValueChange={(itemValue, itemIndex) => setRating(itemValue)}
            style={tw`mb-2`}
          >
            <Picker.Item label="1" value={rateNumbers.ONE} />
            <Picker.Item label="2" value={rateNumbers.TWO} />
            <Picker.Item label="3" value={rateNumbers.THREE} />
            <Picker.Item label="4" value={rateNumbers.FOUR} />
            <Picker.Item label="5" value={rateNumbers.FIVE} />
          </Picker>
  
          <Text style={tw`text-lg font-bold mb-2`}>Ecris un commentaire :</Text>
          <TextInput 
            style={tw`border border-gray-500 rounded p-2 mb-2`}
            multiline 
            numberOfLines={4} 
            onChangeText={text => setComment(text)} 
            value={comment} 
          />
  
          {/* Button to submit the rating/comment */}
          <View style={tw`mt-2`}>
            <Button title="Submit Comment" onPress={handleAddComment} />
          </View>
  
          {/* Button to delete the comment */}
          <View style={tw`mt-2`}>
            <Button title="Delete Comment" onPress={handleDeleteComment} />
          </View>
         </>
        )}
        <Text style={tw`text-lg font-bold mb-2 mt-4`}>Commentaires :</Text>
        {otherComments.map(comment => (
          <View key={comment.id} style={tw`border-b border-gray-300 p-2`}>
            <View>
              <Text style={tw`font-bold mb-1`}>{comment.user.username} {renderStars(comment.rate)}</Text>
              <Text style={tw`text-base`}>{comment.text}</Text>
            </View>
          </View>
        ))}
      </View>
  );
        }

export default CommentScreen;
