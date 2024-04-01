import { stake2vote, vote2stake, voteWeightToday } from "../dist";

test("voting", () => {
  expect( voteWeightToday() ).toBe(24.326923076923077)
});

test("vote2stake", () => {
  expect( vote2stake(1889616753629566208) ).toBe(89792524624.84131)
});

test("stake2vote", () => {
  expect( stake2vote(89792524624.84131) ).toBe(1889616753629566200)
});
