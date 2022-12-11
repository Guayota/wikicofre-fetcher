import "https://deno.land/x/dotenv/load.ts";
import { Client } from "https://deno.land/x/twi/mod.ts";
import {cron, daily, monthly, weekly} from 'https://deno.land/x/deno_cron/cron.ts';

export interface Tweet {
  data?: (DataEntity)[] | null;
  meta: Meta;
}
export interface DataEntity {
  edit_history_tweet_ids?: (string)[] | null;
  id: string;
  text: string;
}
export interface Meta {
  newest_id: string;
  oldest_id: string;
  result_count: number;
  next_token: string;
}

const token = Deno.env.get("BEARER_TOKEN") as string;
const client = new Client(token);
await Deno.writeTextFile("tweets.txt", "");

const fetchCof = async () => {
    const response = await client.tweets.tweetsRecentSearch({
        "query": "from:fuwasnow2 to:ainsoftaur ",
        "max_results": 100
    });


    const tweets = response?.data.map((t) => {
        return t.text   .replace(/@\w*/gm, "")
                        .replace(/https:\/\/t\.co\/\w*/gm, "")
                        .trim();
    });

    await Deno.writeTextFile(
        "tweets.txt", 
        tweets.reduce((acc, next) => acc+"\n___\n"+next, ""),
        {append: true}
    );
}

Deno.listen({ port: 8080 });

weekly(() => {
    fetchCof();
});
