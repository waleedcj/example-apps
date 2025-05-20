import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions } from 'react-native';
import AnimatedProgressBar from '@/components/ui/ProgressBar'; // Adjust path
import { useAppColors } from '@/hooks/useAppColors';
import { Ionicons } from '@expo/vector-icons';

export default function ProgressBarPage() {
  const colors = useAppColors();

  // State for "Level Progress"
  const [levelProgress, setLevelProgress] = useState(0.2);
  const [levelData, setLevelData] = useState({ currentLevel: 1, currentXP: 200, xpToNextLevel: 1000 });

  // State for "Questions Answered"
  const [questionsAnswered, setQuestionsAnswered] = useState(3);
  const totalQuestions = 10;

  // State for "Auto-Incrementing Bar"
  const [autoProgress, setAutoProgress] = useState(0);
  const autoIncrementIntervalRef = useRef<number | null>(null); // Corrected type for React Native

  // Update Level Progress text based on levelData
  useEffect(() => {
    const progressForLevel = levelData.xpToNextLevel > 0 ? levelData.currentXP / levelData.xpToNextLevel : 0;
    setLevelProgress(progressForLevel);
  }, [levelData]);


  // Handlers for Level Progress Bar
  const addXP = (amount: number) => {
    setLevelData(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.currentLevel;
      let newXPToNext = prev.xpToNextLevel;

      if (newXP >= newXPToNext) {
        newLevel++;
        newXP = newXP - newXPToNext; // Carry over
        newXPToNext = Math.floor(newXPToNext * 1.5); // Increase requirement for next level
      }
      return { currentLevel: newLevel, currentXP: newXP, xpToNextLevel: newXPToNext };
    });
  };


  // Handler for Questions Bar
  const answerQuestion = () => {
    setQuestionsAnswered((prev) => Math.min(totalQuestions, prev + 1));
  };

  // Handlers for Auto-Increment Bar 
  const startAutoIncrement = () => {
    if (autoIncrementIntervalRef.current) {
        clearInterval(autoIncrementIntervalRef.current);
        autoIncrementIntervalRef.current = null; // Clear ref
    }
    // Reset progress if it's already full or if starting fresh
    if (autoProgress >= 1 || autoIncrementIntervalRef.current === null) {
        setAutoProgress(0.001); // Start slightly above 0 to trigger animation
    }


    autoIncrementIntervalRef.current = setInterval(() => {
      setAutoProgress((prev) => {
        if (prev >= 1) {
          if (autoIncrementIntervalRef.current) clearInterval(autoIncrementIntervalRef.current);
          autoIncrementIntervalRef.current = null;
          return 1;
        }
        return Math.min(1, prev + 0.02); // Increment by 2%
      });
    }, 100); // Update every 100ms
  };

  const stopAutoIncrement = () => {
    if (autoIncrementIntervalRef.current) {
      clearInterval(autoIncrementIntervalRef.current);
      autoIncrementIntervalRef.current = null;
    }
  };

  const toggleAutoIncrement = () => {
    if (autoIncrementIntervalRef.current) {
        stopAutoIncrement();
    } else {
        startAutoIncrement();
    }
  }

  useEffect(() => {
    return () => { // Cleanup interval on component unmount
      if (autoIncrementIntervalRef.current) {
        clearInterval(autoIncrementIntervalRef.current);
      }
    };
  }, []);

  // Generic Reset Function
  const resetAllProgressBars = () => {
    // Reset Level Progress Bar
    setLevelData({ currentLevel: 1, currentXP: 0, xpToNextLevel: 1000 });
    // setLevelProgress will update via useEffect
    // Reset Questions Answered
    setQuestionsAnswered(0);
    // Reset Auto-Increment Bar and stop interval
    stopAutoIncrement();
    setAutoProgress(0);
  };


  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bgColor }]}>
      <ScrollView contentContainerStyle={styles.screenContainer} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.Neutral900 }]}>Progress Bars</Text>

        {/* 1. Level Progress Bar (Dynamic Gradient based on overall progress) */}
        <View style={styles.progressBarSection}>
          <Text style={[styles.barTitle, {color: colors.Neutral700}]}>
            Level {levelData.currentLevel} Progress
          </Text>
          <AnimatedProgressBar
            progress={levelProgress} // This comes from useEffect [levelData]
            text={`${levelData.currentXP} / ${levelData.xpToNextLevel} XP`}
            icon={<Ionicons name='star-outline' size={18} color={colors.AuxColorTwo} />}
            iconContainerColor={colors.Neutral0}
            height={40}
            width={Dimensions.get("window").width * 0.9} //using this is better than % basically this is 90% 
            trackColor={colors.Neutral90}
            textStyle={{ color: colors.Neutral900, fontWeight: 'bold', fontSize: 12 }}
            reduceMotion='never'
            animationDuration={700}
            colorAtZeroProgress={colors.AuxColorThree}
            colorAtMidProgress={colors.AuxColorThree}
            colorAtFullProgress={colors.AuxColorThree}
          />
           <View style={styles.controlsRow}>
            <Button title="-50 XP" onPress={() => addXP(-50)} disabled={levelData.currentXP <=0 && levelData.currentLevel === 1}/>
            <View style={styles.buttonSpacer} />
            <Button title="+99 XP" onPress={() => addXP(99)}/>
          </View>
        </View>

        {/* 2. Questions Answered (out of 10) */}
        <View style={styles.progressBarSection}>
          <Text style={[styles.barTitle, {color: colors.Neutral700}]}>Quiz Progress</Text>
          <AnimatedProgressBar
            progress={totalQuestions > 0 ? questionsAnswered / totalQuestions : 0}
            text={`${questionsAnswered} / ${totalQuestions} Answered`}
            icon={<Ionicons name='checkmark-done-circle-outline' size={20} color={colors.Neutral0} />}
            iconContainerColor={colors.Neutral700}
            height={35}
            width={Dimensions.get("window").width * 0.9}
            trackColor={colors.Neutral70}
            textStyle={{ color: colors.Neutral0, fontWeight: 'bold', fontSize: 11 }}
            reduceMotion='never'
            colorAtZeroProgress={colors.SuccessfulNormal}
            colorAtMidProgress={colors.SuccessfulNormal}
            colorAtFullProgress={colors.SuccessfulNormal}
          />
          <View style={styles.controlsRow}>
            <Button title="Answer One" onPress={answerQuestion} disabled={questionsAnswered >= totalQuestions}/>
          </View>
        </View>

        {/* 3. Auto-Incrementing Bar */}
        <View style={styles.progressBarSection}>
          <Text style={[styles.barTitle, {color: colors.Neutral700}]}>System Update</Text>
          <AnimatedProgressBar
            progress={autoProgress}
            text={autoProgress >= 1 ? "Update Complete!" : `Updating... ${Math.round(autoProgress*100)}%`}
            icon={<Ionicons name='sync-circle-outline' size={18} color={colors.Neutral0} />}
            iconContainerColor={autoProgress >= 1 ? colors.SuccessfulNormal : colors.AuxColorTwo}
            height={30}
            width={Dimensions.get("window").width * 0.9}
            trackColor={colors.Neutral90}
            textStyle={{ color: colors.Neutral0, fontWeight: '500', fontSize: 10 }}
              reduceMotion='never'
          />
          <View style={styles.controlsRow}>
            <Button 
                title={autoIncrementIntervalRef.current ? "Pause Update" : (autoProgress >=1 ? "Restart Update" : "Start Update")} 
                onPress={toggleAutoIncrement} 
            />
          </View>
        </View>
        
        <View style={styles.mainControlsContainer}>
          <Button title="Reset All Progress" onPress={resetAllProgressBars} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  progressBarSection: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  barTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  buttonSpacer: {
    width: 10,
  },
  mainControlsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});