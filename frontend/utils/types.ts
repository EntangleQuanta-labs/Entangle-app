import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Workflow: { workflowId: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type WorkflowScreenProps = NativeStackScreenProps<RootStackParamList, 'Workflow'>;