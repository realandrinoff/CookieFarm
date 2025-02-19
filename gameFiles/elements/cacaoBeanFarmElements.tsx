import { View, Text, Image, Platform } from "react-native";
import { styles } from "../../assets/Styles";
import {
  increaseCacaoLevel,
  resetCacaoLevel,
} from "../../dataManagement/cacaoData";
import {
  CacaoContext,
  CacaoDispatchContext,
} from "../../app/context/cacaoContext";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { checkCacaoLevel } from "../../dataManagement/cacaoData";
import {
  CookieDispatchContext,
  CookieContext,
} from "../../app/context/cookieContext";
import { CacaoUpgradePrice } from "../maps/UpgradePriceMap";
import { LevelContext } from "../../levelSystem/data/context/levelContext";

export const CacaoFarmLevel = ({}) => {
  var [cacaoLevel, setCacaoLevel] = useState<number>();
  const levelCount = useContext(LevelContext);
  useEffect(() => {
    if (levelCount < 2) {
      (async () => {
        setCacaoLevel(1);
        await resetCacaoLevel();
      })();
    } else {
      (async () => {
        setCacaoLevel(await checkCacaoLevel(setCacaoLevel));
      })();
    }
  });
  return (
    <View>
      <Text style={styles.cacaoTreeUpgradeText}>Cacao level: {cacaoLevel}</Text>
      <UpgradeCacaoButton
        setCacaoLevel={setCacaoLevel}
        cacaoLevel={cacaoLevel}
      />
      <CacaoButton cacaoLevel={cacaoLevel} setCacaoLevel={setCacaoLevel} />
    </View>
  );
};

export const CacaoButton = ({ cacaoLevel, setCacaoLevel }) => {
  useEffect(() => {
    (async () => {
      await checkCacaoLevel(setCacaoLevel);
    })();
  });
  const dispatch = useContext(CacaoDispatchContext);
  return (
    <View style={styles.cacaoContainer}>
      <Image
        source={require("../../assets/images/cacaotree.png")}
        style={styles.cacaoTree}
      />
      <Text
        style={styles.cacaoTreeCollectText}
        onPress={() => {
          (async () => {
            setCacaoLevel(await checkCacaoLevel(setCacaoLevel));
          })();
          dispatch({
            type: "add",
            value: cacaoLevel,
          });
        }}
      >
        Collect cacao
      </Text>
    </View>
  );
};

export const CacaoCounter = ({ cacaoAmount }) => {
  return (
    <View style={styles.cacaoCounter}>
      <Image
        source={require("../../assets/images/cacao-regular.png")}
        style={styles.cacaoCounterImage}
      />
      <Text style={styles.cookieCounterText}>{cacaoAmount}</Text>
    </View>
  );
};

const UpgradeCacaoButton = ({ setCacaoLevel, cacaoLevel }) => {
  const dispatch = useContext(CookieDispatchContext);
  const cookieCount = useContext(CookieContext);
  var [notEnough, setNotEnough] = useState(false);

  return (
    <View style={styles.cacaoTreeUpgradeContainer}>
      <Text
        style={styles.cacaoTreeUpgradeText}
        onPress={() => {
          if (cacaoLevel < 5) {
            if (cookieCount < CacaoUpgradePrice.get(cacaoLevel)) {
              return <Text>You don't have enough cookies</Text>;
            } else {
              setNotEnough(false);
              dispatch({
                type: "remove",
                value: CacaoUpgradePrice.get(cacaoLevel),
              });
              setCacaoLevel(cacaoLevel + 1);
              (async () => {
                await increaseCacaoLevel();
              })();
            }
          } else {
          }
        }}
      >
        {[
          cacaoLevel == 5
            ? "You have reached MAX level"
            : CacaoUpgradePrice.get(cacaoLevel) > cookieCount
            ? "You need " +
              (CacaoUpgradePrice.get(cacaoLevel) - cookieCount) +
              " more cookies " 
            : "Upgrade cacao level to " +
              (cacaoLevel + 1) +
              " for " +
              CacaoUpgradePrice.get(cacaoLevel) +
              " cookies",
        ]}
      </Text>
      <Text
        style={styles.cacaoTreeUpgradeText}
        onPress={() => {
          resetCacaoLevel();
          setCacaoLevel(1);
        }}
      >
        Test Reset
      </Text>
    </View>
  );
};
