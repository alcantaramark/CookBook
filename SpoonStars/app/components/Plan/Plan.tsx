import React, { FC, Fragment } from 'react';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header/Header';


interface PlanProps {}

const Plan: FC<PlanProps> = () => (
  <Fragment>
  <SafeAreaView>
    <Text>
      Plan Component
    </Text>
  </SafeAreaView>
  </Fragment>
);

export default Plan;
