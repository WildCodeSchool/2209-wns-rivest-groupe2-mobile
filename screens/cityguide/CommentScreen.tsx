import React, { useState, useMemo } from "react";
import {
  RefreshControl,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable,
  Button,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButon from "../../components/Button";
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
} from "../../services/queries/Poi";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/FontAwesome";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Controller } from "react-hook-form";
import moment from "moment";

const CommentScreen = ({ route, navigation }) => {
  const [currentCommentRate, setCurrentCommentRate] = useState<rateNumbers>(
    rateNumbers.ONE
  );
  const [currentCommentText, setCurrentCommentText] = useState("");
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);
  const user = useRecoilValue(userState);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  const { poiId } = route.params;

  const {
    data: poiData,
    loading: poiLoading,
    refetch,
  } = useQuery(GET_POI_BY_ID_QUERY, {
    variables: { getPoIbyIdId: poiId },
  });

  const userComment = useMemo(() => {
    if (!user && !poiData) return null;
    return poiData.getPOIbyId.comments.filter(
      (comment) => comment.user.id === user?.userFromDB.id
    );
  }, [poiData, user?.userFromDB.id]);

  const otherComments = useMemo(() => {
    if (!poiData) return [];
    if (user) {
      return poiData.getPOIbyId.comments.filter(
        (comment) => comment.user.id !== user.userFromDB.id
      );
    } else {
      return poiData.getPOIbyId.comments;
    }
  }, [poiData, user?.userFromDB.id]);

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    context: {
      headers: {
        authorization: `Bearer ${user?.token}`,
      },
    },
    refetchQueries: [
      { query: GET_POI_BY_ID_QUERY, variables: { getPoIbyIdId: poiId } },
      { query: GET_COMMENTS_NUMBER_PER_POI, variables: { poiId } },
    ],
  });
  const [commentPOI] = useMutation(COMMENT_POI_MUTATION, {
    context: {
      headers: {
        authorization: `Bearer ${user?.token}`,
      },
    },
    refetchQueries: [
      { query: GET_POI_BY_ID_QUERY, variables: { getPoIbyIdId: poiId } },
      { query: GET_COMMENTS_NUMBER_PER_POI, variables: { poiId } },
    ],
  });

  const [updateComment] = useMutation(UPDATE_COMMENT_POI_MUTATION, {
    context: {
      headers: {
        authorization: `Bearer ${user?.token}`,
      },
    },
    refetchQueries: [
      { query: GET_POI_BY_ID_QUERY, variables: { poiId } },
      { query: GET_COMMENTS_NUMBER_PER_POI, variables: { poiId } },
    ],
  });

  const handleAddComment = async () => {
    try {
      await commentPOI({
        variables: {
          poiId: poiId,
          userId: user.userFromDB.id,
          comment: currentCommentText,
          rate: currentCommentRate,
        },
      });
      Alert.alert("Commentaire créé avec succès");
      setCurrentCommentText(undefined);
      setCurrentCommentRate(rateNumbers.ONE);
    } catch (error) {
      Alert.alert(`Erreur lors de l'ajout du commentaire: ${error.message}`);
    }
  };

  const handleUpdateComment = async () => {
    try {
      await updateComment({
        variables: {
          commentId: currentCommentId,
          comment: currentCommentText,
          rate: currentCommentRate,
          userId: user.userFromDB.id,
          poiId: poiId,
        },
      });
      Alert.alert("Commentaire modifié avec succès");
      setCurrentCommentText(undefined);
      setCurrentCommentRate(rateNumbers.ONE);
      setCurrentCommentId(null);
      setShowEditModal(false);
    } catch (error) {
      Alert.alert(
        `Erreur lors de la mise à jour du commentaire: ${error.message}`
      );
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment({
        variables: { commentId: currentCommentId, userId: user.userFromDB.id },
      });
      Alert.alert("Commentaire supprimé avec succès");
      setCurrentCommentId(null);
      setShowDeleteModal(false);
    } catch (error) {
      Alert.alert(
        `Erreur lors de la suppression du commentaire: ${error.message}`
      );
    }
  };

  if (poiLoading) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={poiLoading} onRefresh={refetch} />
        }
      >
        {userComment && userComment.length > 0 && (
          <Text style={tw`text-lg font-bold mt-5 mb-2`}>
            Tes commentaires :
          </Text>
        )}
        {userComment.map((comment) => (
          <View key={comment.id}>
            {renderStars(comment.rate)}
            <Text style={tw`text-base mb-2`}>{comment.text}</Text>
            <Text>
              Créé le {moment(comment.createDate).format("DD-MM-YYYY à HH:MM")}
              {comment.updateDate
                ? ", Modifié le " +
                  moment(comment.updateDate).format("DD-MM-YYYY à HH:MM")
                : null}
            </Text>
            <View style={styles.buttonsContainerUpdate}>
              <View style={styles.buttonUpdate}>
                <Icon.Button
                  name="edit"
                  borderRadius={500}
                  size={20}
                  iconStyle={{
                    margin: 2,
                    paddingLeft: 8,
                    paddingVertical: 5,
                  }}
                  backgroundColor="#C5C5C5"
                  onPress={() => {
                    setShowEditModal(true);
                    setCurrentCommentText(comment.text);
                    setCurrentCommentRate(comment.rate);
                    setCurrentCommentId(comment.id);
                  }}
                />
              </View>
              <View style={styles.buttonUpdate}>
                <AntIcon.Button
                  borderRadius={500}
                  size={20}
                  iconStyle={{
                    margin: 2,
                    paddingLeft: 8,
                    paddingVertical: 5,
                  }}
                  name="delete"
                  backgroundColor="#C5C5C5"
                  onPress={() => {
                    console.log("comment", comment);
                    console.log("comment id", comment.id);
                    setCurrentCommentId(comment.id);
                    setShowDeleteModal(true);
                  }}
                />
              </View>
            </View>
          </View>
        ))}
        {user !== null &&
          (!isAdding ? (
            <View style={styles.addContainer}>
              <Text
                style={{
                  fontSize: 20,
                  marginTop: userComment.length === 0 ? 50 : 20,
                  marginBottom: 5,
                  fontWeight: "bold",
                }}
              >
                Evaluez ce {poiData.getPOIbyId.type}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>
                Partagez votre avis avec les autres utilisateurs
              </Text>
              <CustomButon onPress={() => setIsAdding(true)}>
                Ajouter un commentaire
              </CustomButon>
            </View>
          ) : (
            <View style={tw`mt-5`}>
              <Picker
                selectedValue={currentCommentRate}
                onValueChange={(itemValue, itemIndex) =>
                  setCurrentCommentRate(itemValue)
                }
                style={tw`mb-2`}
              >
                <Picker.Item label="1" value={rateNumbers.ONE} />
                <Picker.Item label="2" value={rateNumbers.TWO} />
                <Picker.Item label="3" value={rateNumbers.THREE} />
                <Picker.Item label="4" value={rateNumbers.FOUR} />
                <Picker.Item label="5" value={rateNumbers.FIVE} />
              </Picker>
              <TextInput
                style={tw`border border-gray-500 rounded p-2 mb-2`}
                numberOfLines={2}
                onChangeText={(text) => setCurrentCommentText(text)}
                value={currentCommentText}
              />
              <View style={tw`mt-2`}>
                <CustomButon onPress={handleAddComment}>
                  Sauvegarder
                </CustomButon>
              </View>
              <Pressable
                style={styles.buttonCancel}
                onPress={() => setIsAdding(false)}
              >
                <Text style={styles.buttonCancelText}>Annuler</Text>
              </Pressable>
            </View>
          ))}
        <View style={(!user || !userComment) && styles.noUserComment}>
          <Text style={tw`text-lg font-bold mb-2 mt-4`}>
            Commentaires utilisateurs :
          </Text>
          {otherComments.length > 0 ? (
            otherComments.map((comment) => (
              <View key={comment.id} style={styles.otherCommentsContainer}>
                <View>
                  {renderStars(comment.rate)}
                  <Text style={tw`text-base mb-2`}>{comment.text}</Text>
                  <Text>
                    Créé le{" "}
                    {moment(comment.createDate).format("DD-MM-YYYY à HH:MM")}
                    {comment.updateDate
                      ? ", Modifié le " +
                        moment(comment.updateDate).format("DD-MM-YYYY à HH:MM")
                      : null}
                  </Text>
                  <Text style={tw`font-bold mb-1`}>
                    {comment.user.username}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={tw`p-2`}>
              <Text>Aucun commentaire renseigné actuellement</Text>
            </View>
          )}
        </View>
        <Modal
          animationType="slide"
          visible={showEditModal}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={currentCommentRate}
              onValueChange={(itemValue, itemIndex) =>
                setCurrentCommentRate(itemValue)
              }
              style={tw`mb-2`}
            >
              <Picker.Item label="1" value={rateNumbers.ONE} />
              <Picker.Item label="2" value={rateNumbers.TWO} />
              <Picker.Item label="3" value={rateNumbers.THREE} />
              <Picker.Item label="4" value={rateNumbers.FOUR} />
              <Picker.Item label="5" value={rateNumbers.FIVE} />
            </Picker>
            <TextInput
              style={tw`border border-gray-500 rounded p-2 my-2`}
              numberOfLines={2}
              onChangeText={(text) => setCurrentCommentText(text)}
              value={currentCommentText}
            />
            <View style={tw`mt-2`}>
              <CustomButon onPress={handleUpdateComment}>
                Sauvegarder
              </CustomButon>
              <Pressable
                style={styles.buttonCancel}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.buttonCancelText}>Annuler</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Etes-vous sûr de vouloir supprimer votre commentaire ?
            </Text>
            <View style={tw`mt-2`}>
              <CustomButon onPress={handleDeleteComment}>Supprimer</CustomButon>
              <Pressable
                style={styles.buttonCancel}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.buttonCancelText}>Annuler</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, margin: 15 },
  stars: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  buttonsContainerUpdate: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
  },
  buttonUpdate: {
    marginHorizontal: 8,
    alignSelf: "center",
    textAlign: "center",
  },
  addContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#C5C5C5",
  },
  buttonCancel: {
    borderRadius: 15,
    backgroundColor: "#C5C5C5",
    width: "50%",
    marginLeft: "25%",
  },
  buttonCancelText: {
    padding: 10,
    color: "white",
    textAlign: "center",
  },
  noUserComment: {
    marginTop: "30%",
  },
  otherCommentsContainer: {
    paddingBottom: 16,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#C5C5C5",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    width: "80%",
    marginLeft: "10%",
  },
});

{
  /* <View>
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
<TextInput
  style={tw`border border-gray-500 rounded p-2 my-2`}
  numberOfLines={2}
  onChangeText={(text) => setComment(text)}
  value={comment}
/>
<View style={tw`mt-2`}>
  <Button title="Sauvegarder" onPress={handleUpdateComment} />
</View>
<View style={tw`mt-2`}>
  <Button title="Annuler" onPress={() => setIsAdding(false)} />
</View>
</View> */
}
