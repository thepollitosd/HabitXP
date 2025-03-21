import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, Search, Link } from "lucide-react";
import FriendsList from "./FriendsList";
import FriendSearch from "./FriendSearch";
import InviteFriend from "./InviteFriend";

export default function FriendsTab() {
  const [activeTab, setActiveTab] = useState("friends");

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Friends & Social
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="friends" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              My Friends
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Find Friends
            </TabsTrigger>
            <TabsTrigger value="invite" className="flex items-center">
              <Link className="h-4 w-4 mr-2" />
              Invite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-0">
            <FriendsList />
          </TabsContent>

          <TabsContent value="search" className="mt-0">
            <FriendSearch />
          </TabsContent>

          <TabsContent value="invite" className="mt-0">
            <div className="py-4 text-center space-y-4">
              <p className="text-gray-600 mb-4">
                Generate an invite link to share with your friends or enter an
                invite code you received.
              </p>
              <InviteFriend />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
