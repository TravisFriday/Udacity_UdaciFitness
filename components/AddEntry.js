import React, { Component } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { getMetricMetaInfo, timeToString } from "../utils/helpers";
import UdacitySlider from "./UdacitySlider";
import UdacityStepper from "./UdacityStepper";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { submitEntry, removeEntry } from "../utils/api";

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  );
}

export default class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };

  //increment run, bike and swim
  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState(state => {
      const count = state[metric] + step;
      return {
        ...state,
        [metric]: count > max ? max : count
      };
    });
  };

  // decrement run, bike and swim
  decrement = metric => {
    const { step } = getMetricMetaInfo(metric);

    this.setState(state => {
      const count = state[metric] - step;
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      };
    });
  };

  //slider that will increase and decrease sleep and eat
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }));
  };

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    //update redux

    //reset controlled component state
    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    }));

    //navigate to home

    //update "DB"
    submitEntry({ entry, key });

    //clear local notification
  };

  reset = () => {
    const key = timeToString();

    // Update Redux

    // Route to Home

    // Update "DB" (how will this work?)
    removeEntry(key);
  };

  render() {
    const metaInfo = getMetricMetaInfo();
    console.log(this.state);

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name="ios-happy" size={100} />
          <Text>You already logged your information for today</Text>
          <TextButton onPress={this.reset}>reset</TextButton>
        </View>
      );
    }

    return (
      <ScrollView>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];
          return (
            <View key={key}>
              {getIcon()}
              {type === "slider" ? (
                <UdacitySlider
                  value={value}
                  onChange={value => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <UdacityStepper
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </ScrollView>
    );
  }
}
