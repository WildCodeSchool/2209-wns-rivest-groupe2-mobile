import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { rateNumbers } from "../../types/IComment";
import { useMutation, useQuery } from "@apollo/client";
import {
  COMMENT_POI_MUTATION,
  DELETE_COMMENT,
  UPDATE_COMMENT_POI_MUTATION,
} from "../../services/mutations/comment";
import { useRecoilValue } from "recoil";
import { userState } from "../../atom/userAtom";
import {
  GET_COMMENTS_NUMBER_PER_POI,
  GET_POI_BY_ID_QUERY,
  GET_POI_QUERY,
  GET_USER_COMMENT_POI_QUERY,
} from "../../services/queries/Poi";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/FontAwesome";
import AntIcon from "react-native-vector-icons/AntDesign";

const CommentScreen = ({ route, navigation }) => {
  const [rating, setRating] = useState<rateNumbers>(rateNumbers.FOUR);
  const [comment, setComment] = useState("");
  const user = useRecoilValue(userState);
  const [isEditing, setIsEditing] = useState(false);

  const { poiId } = route.params;

  console.log("poiId", poiId);

  const { data: poiData, loading: poiLoading } = useQuery(GET_POI_BY_ID_QUERY, {
    variables: { getPoIbyIdId: poiId },
  });

  const { loading: userCommentLoading, data: userCommentData } = useQuery(
    GET_USER_COMMENT_POI_QUERY,
    {
      variables: { userId: user.userFromDB.id, poiId },
    }
  );

  console.log("poiData", poiData);

  const userComment = useMemo(() => {
    if (!poiData) return null;
    return poiData.getPOIbyId.comments.filter(
      (comment) => comment.user.id === user.userFromDB.id
    );
  }, [poiData, user.userFromDB.id]);

  const otherComments = useMemo(() => {
    if (!poiData) return [];
    return poiData.getPOIbyId.comments.filter(
      (comment) => comment.user.id !== user.userFromDB.id
    );
  }, [poiData, user.userFromDB.id]);

  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [commentPOI] = useMutation(COMMENT_POI_MUTATION, {
    context: {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    },
    refetchQueries: [
      { query: GET_POI_BY_ID_QUERY, variables: { poiId } },
      { query: GET_COMMENTS_NUMBER_PER_POI, variables: { poiId } },
    ],
  });

  const [updateComment, { loading: updateLoading }] = useMutation(
    UPDATE_COMMENT_POI_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      },
      refetchQueries: [
        { query: GET_POI_BY_ID_QUERY, variables: { poiId } },
        { query: GET_COMMENTS_NUMBER_PER_POI, variables: { poiId } },
      ],
    }
  );

  console.log("token", user.token);

  const handleAddComment = async () => {
    try {
      await commentPOI({
        variables: {
          poiId: poiId,
          userId: user.userFromDB.id,
          comment: comment,
          rate: rating,
        },
      });
      Alert.alert("Commentaire créé avec succès");
      navigation.navigate("ItemScreen", { param: poiId });
      setComment(undefined);
      setRating(rateNumbers.FOUR);
    } catch (error) {
      Alert.alert(`Erreur lors de l'ajout du commentaire: ${error.message}`);
    }
  };

  const handleUpdateComment = async () => {
    try {
      await updateComment({
        variables: {
          commentId: userComment.id,
          comment: comment,
          rate: rating,
          userId: user.userFromDB.id,
          poiId: poiId,
        },
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

  console.log(
    "poiId",
    poiId,
    "userId",
    user.userFromDB.id,
    "comment",
    comment,
    "rate",
    rating
  );

  useEffect(() => {
    if (userCommentData) {
      setComment(userCommentData.comment);
      setRating(userCommentData.rating);
    }
  }, [userCommentData]);

  if (userCommentLoading || poiLoading || updateLoading) {
    return <ActivityIndicator />;
  }

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const goldenStars = Array.from({ length: rating }).map((_, i) => {
      return <Icon name="star" size={15} color="gold" key={i} />;
    });
    const greyStars = Array.from({ length: totalStars - rating }).map(
      (_, i) => {
        return <Icon name="star" size={15} color="grey" key={i + rating} />;
      }
    );
    return (
      <View style={styles.stars}>
        {goldenStars}
        {greyStars}
      </View>
    );
  };

  console.log("userComment", userComment);

  return (
    <ScrollView style={tw`p-4 mt-4`}>
      <Text style={tw`text-lg font-bold mt-5 mb-2`}>Tes commentaires :</Text>
      {userComment &&
        userComment.length > 0 &&
        userComment.map((comment) => (
          <View key={comment.id}>
            {renderStars(comment.rate)}
            <Text style={tw`text-base mb-2`}>{comment.text}</Text>
            <View style={styles.buttonsContainer}>
              <View style={styles.button}>
                <Icon.Button
                  name="edit"
                  borderRadius={500}
                  size={20}
                  iconStyle={{ margin: 2, paddingLeft: 8, paddingVertical: 5 }}
                  backgroundColor="#C5C5C5"
                  onPress={() => {
                    setIsEditing(true);
                    setComment(comment.text);
                    setRating(comment.rate);
                  }}
                />
              </View>
              <View style={styles.button}>
                <AntIcon.Button
                  borderRadius={500}
                  size={20}
                  iconStyle={{ margin: 2, paddingLeft: 8, paddingVertical: 5 }}
                  name="delete"
                  backgroundColor="#C5C5C5"
                  onPress={() => {
                    setIsEditing(true);
                    setComment(comment.text);
                    setRating(comment.rate);
                  }}
                />
              </View>
            </View>
          </View>
        ))}
      <View>
        <Text>Evaluez ce {poiData.getPOIbyId.type}</Text>
        <Text>Partagez votre avis avec les autres utilisateurs</Text>
        <Button
          title="Ajouter un commentaire"
          onPress={() => setIsEditing(true)}
        />
      </View>
      <View>
        <Text style={tw`text-lg font-bold mb-2 mt-4`}>
          Commentaires utilisateurs :
        </Text>
        {otherComments.length > 0 ? (
          otherComments.map((comment) => (
            <View key={comment.id} style={tw`border-b border-gray-300 p-2`}>
              <View>
                {renderStars(comment.rate)}
                <Text style={tw`font-bold mb-1`}>{comment.user.username}</Text>
                <Text style={tw`text-base mb-2`}>{comment.text}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={tw`p-2`}>
            <Text>Aucun commentaire renseigné actuellement</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  stars: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
  },
  button: {
    marginHorizontal: 8,
    alignSelf: "center",
    textAlign: "center",
  },
});
