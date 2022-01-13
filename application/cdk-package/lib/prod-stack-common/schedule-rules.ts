import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import * as lambda from "@aws-cdk/aws-lambda";
import { IFunction } from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";

function createLambdaFunctionTarget(lambda: IFunction, minutes: number) {
  return new targets.LambdaFunction(lambda, {
    event: events.RuleTargetInput.fromObject({ periodInMinutes: minutes }),
  });
}

export class ScheduleRules extends cdk.Construct {
  public readonly oneMinuteRule: events.Rule;
  public readonly fiveMinuteRule: events.Rule;
  public readonly fifteenMinuteRule: events.Rule;
  public readonly thirtyMinuteRule: events.Rule;
  public readonly oneHourRule: events.Rule;
  public readonly threeHourRule: events.Rule;
  public readonly sixHourRule: events.Rule;
  public readonly twelveHourRule: events.Rule;
  public readonly twentyFourHourRule: events.Rule;
  public readonly oneWeekRule: events.Rule;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      jobRunnerLambda: lambda.Function;
      weeklyReportLambda?: lambda.Function;
      region: string;
    }
  ) {
    super(scope, id);

    const { region, jobRunnerLambda, weeklyReportLambda } = props;

    this.oneMinuteRule = new events.Rule(
      this,
      region + "_komonitor_prod_1min_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(1)),
      }
    );

    this.fiveMinuteRule = new events.Rule(
      this,
      region + "_komonitor_prod_5min_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(5)),
      }
    );

    this.fifteenMinuteRule = new events.Rule(
      this,
      "komonitor_prod_15min_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(15)),
      }
    );

    this.thirtyMinuteRule = new events.Rule(
      this,
      region + "_komonitor_prod_30min_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(30)),
      }
    );

    this.oneHourRule = new events.Rule(
      this,
      region + "_komonitor_prod_1hr_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(60)),
      }
    );

    this.threeHourRule = new events.Rule(
      this,
      region + "_komonitor_prod_3hr_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(180)),
      }
    );

    this.sixHourRule = new events.Rule(
      this,
      region + "_komonitor_prod_6hr_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(360)),
      }
    );

    this.twelveHourRule = new events.Rule(
      this,
      region + "_komonitor_prod_12hr_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(720)),
      }
    );

    this.twentyFourHourRule = new events.Rule(
      this,
      region + "_komonitor_prod_24hr_rule",
      {
        schedule: events.Schedule.rate(Duration.minutes(1440)),
      }
    );

    this.oneWeekRule = new events.Rule(this, "_komonitor_prod_one_week_rule", {
      schedule: events.Schedule.rate(Duration.days(7)),
    });

    this.oneMinuteRule.addTarget(
      createLambdaFunctionTarget(jobRunnerLambda, 1)
    );
    this.fiveMinuteRule.addTarget(
      createLambdaFunctionTarget(jobRunnerLambda, 5)
    );
    this.fifteenMinuteRule.addTarget(
      createLambdaFunctionTarget(jobRunnerLambda, 15)
    );
    this.thirtyMinuteRule.addTarget(
      createLambdaFunctionTarget(jobRunnerLambda, 30)
    );
    this.oneHourRule.addTarget(createLambdaFunctionTarget(jobRunnerLambda, 60));
    this.threeHourRule.addTarget(
      createLambdaFunctionTarget(jobRunnerLambda, 180)
    );
    this.sixHourRule.addTarget(
      createLambdaFunctionTarget(jobRunnerLambda, 360)
    );
    this.twelveHourRule.addTarget(
      createLambdaFunctionTarget(jobRunnerLambda, 720)
    );
    this.twentyFourHourRule.addTarget(
      createLambdaFunctionTarget(jobRunnerLambda, 1440)
    );

    if (weeklyReportLambda) {
      this.oneWeekRule.addTarget(
        new targets.LambdaFunction(weeklyReportLambda, {
          event: events.RuleTargetInput.fromObject({}),
        })
      );
      targets.addLambdaPermission(this.oneWeekRule, weeklyReportLambda);
    }

    targets.addLambdaPermission(this.oneMinuteRule, jobRunnerLambda);
    targets.addLambdaPermission(this.fiveMinuteRule, jobRunnerLambda);
    targets.addLambdaPermission(this.fifteenMinuteRule, jobRunnerLambda);
    targets.addLambdaPermission(this.thirtyMinuteRule, jobRunnerLambda);
    targets.addLambdaPermission(this.oneHourRule, jobRunnerLambda);
    targets.addLambdaPermission(this.threeHourRule, jobRunnerLambda);
    targets.addLambdaPermission(this.sixHourRule, jobRunnerLambda);
    targets.addLambdaPermission(this.twelveHourRule, jobRunnerLambda);
    targets.addLambdaPermission(this.twentyFourHourRule, jobRunnerLambda);
  }
}
