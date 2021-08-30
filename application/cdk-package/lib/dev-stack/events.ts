import * as cdk from "@aws-cdk/core";
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import * as lambda from "@aws-cdk/aws-lambda";
import { Duration } from "@aws-cdk/core";

export class UptimeCheckScheduleRules extends cdk.Construct {
  public readonly fiveMinuteRule: events.Rule;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: { uptimeCheckJobRunnerLambda: lambda.Function }
  ) {
    super(scope, id);

    this.fiveMinuteRule = new events.Rule(this, "dev_uptime_check_5min_rule", {
      schedule: events.Schedule.rate(Duration.minutes(5)),
    });

    this.fiveMinuteRule.addTarget(
      new targets.LambdaFunction(props.uptimeCheckJobRunnerLambda, {
        event: events.RuleTargetInput.fromObject({}), //TODO
      })
    );
  }
}