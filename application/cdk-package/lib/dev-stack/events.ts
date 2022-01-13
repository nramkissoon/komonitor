import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";

export class ScheduleRules extends cdk.Construct {
  public readonly thirtyMinuteRule: events.Rule;
  public readonly weekRule: events.Rule;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      jobRunnerLambda: lambda.Function;
      weeklyReportLambda: lambda.Function;
    }
  ) {
    super(scope, id);

    this.thirtyMinuteRule = new events.Rule(
      this,
      "dev_uptime_check_30min_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(30)),
      }
    );

    this.weekRule = new events.Rule(this, "week_rule", {
      schedule: events.Schedule.rate(Duration.days(7)),
    });

    this.thirtyMinuteRule.addTarget(
      new targets.LambdaFunction(props.jobRunnerLambda, {
        event: events.RuleTargetInput.fromObject({ periodInMinutes: 30 }),
      })
    );

    this.weekRule.addTarget(
      new targets.LambdaFunction(props.weeklyReportLambda, {
        event: events.RuleTargetInput.fromObject({}),
      })
    );

    targets.addLambdaPermission(this.thirtyMinuteRule, props.jobRunnerLambda);

    targets.addLambdaPermission(this.weekRule, props.weeklyReportLambda);
  }
}
